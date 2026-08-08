import { create } from 'zustand'
import fishboneService from '../services/fishboneService.js'
import departmentService from '../services/departmentService.js'
import { useBscContextStore } from './bscContextStore.js'
import { useBSCWorkflowStore } from './bscWorkflowStore.js'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

const DEPT_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#0891b2', '#ec4899', '#84cc16']

export const useFishboneStore = create((set, get) => ({
  departments: [],
  viewAs: 'ceo',
  currentDeptId: null,

  // participations[deptId][objectiveId] = participationId (UUID string) | null
  participations: {},

  // deptKPIs[deptId][objectiveId] = [{id (backend UUID), name, description}]
  deptKPIs: {},

  loading: false,
  saving: false,
  error: null,

  // ── Load departments from backend ─────────────────────────────────────────
  loadDepartments: async () => {
    const { companyId } = useBscContextStore.getState()
    if (!companyId) return
    set({ loading: true })
    try {
      const depts = await departmentService.listByCompany(companyId)
      const mapped = (depts || []).map((d, i) => ({
        id: d.id,
        name: d.name,
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }))
      set({
        departments: mapped,
        currentDeptId: mapped[0]?.id ?? null,
        loading: false,
      })
    } catch {
      set({ loading: false })
    }
  },

  setViewAs: (val) => set({ viewAs: val }),
  setCurrentDept: (deptId) => set({ currentDeptId: deptId }),

  // ── Toggle participation ──────────────────────────────────────────────────
  toggleParticipation: async (deptId, objectiveId) => {
    const { participations } = get()
    const deptPart = participations[deptId] ?? {}
    const existingParticipationId = deptPart[objectiveId]
    const strategyId = useBscContextStore.getState().strategyId

    if (existingParticipationId) {
      // Remove participation
      set((state) => ({
        participations: {
          ...state.participations,
          [deptId]: { ...state.participations[deptId], [objectiveId]: null },
        },
      }))
      if (strategyId) {
        fishboneService.removeParticipation(existingParticipationId).catch(console.error)
      }
    } else {
      // Join participation
      const tempId = `temp-${uid()}`
      set((state) => ({
        participations: {
          ...state.participations,
          [deptId]: { ...(state.participations[deptId] ?? {}), [objectiveId]: tempId },
        },
      }))
      if (strategyId) {
        try {
          const resp = await fishboneService.joinFinalObjective(strategyId, {
            finalStrategicObjectiveId: objectiveId,
            departmentId: deptId,
          })
          if (resp?.id) {
            set((state) => ({
              participations: {
                ...state.participations,
                [deptId]: { ...(state.participations[deptId] ?? {}), [objectiveId]: resp.id },
              },
            }))
          }
        } catch (e) {
          console.error('joinFinalObjective failed:', e)
          set((state) => ({
            participations: {
              ...state.participations,
              [deptId]: { ...state.participations[deptId], [objectiveId]: null },
            },
            error: e.message || 'Lỗi khi tham gia mục tiêu',
          }))
          const { toast } = await import('../components/ui/toast.jsx')
          toast.error(e.message || 'Lỗi khi tham gia mục tiêu')
        }
      }
    }
  },

  isParticipating: (deptId, objectiveId) => {
    const { participations } = get()
    return !!(participations[deptId] ?? {})[objectiveId]
  },

  // ── KPI CRUD ──────────────────────────────────────────────────────────────
  addKPI: async (deptId, objectiveId, name, description = '') => {
    const { participations } = get()
    const participationId = (participations[deptId] ?? {})[objectiveId]
    const { strategyId } = useBscContextStore.getState()

    const tempId = `temp-${uid()}`
    // Optimistic add
    set((state) => {
      const deptKPI = state.deptKPIs[deptId] ?? {}
      const existing = deptKPI[objectiveId] ?? []
      return {
        deptKPIs: {
          ...state.deptKPIs,
          [deptId]: { ...deptKPI, [objectiveId]: [...existing, { id: tempId, name: name.trim(), description: description.trim() }] },
        },
      }
    })

    // Only call API if participationId is a real backend UUID (not a temp-xxx fallback)
    const isRealId = participationId && !String(participationId).startsWith('temp-')
    if (strategyId && isRealId) {
      try {
        const kpi = await fishboneService.createDepartmentKpi({
          bscStrategyId: strategyId,
          finalStrategicObjectiveId: objectiveId,
          departmentId: deptId,
          departmentParticipationId: participationId,
          name: name.trim(),
          description: description.trim(),
          displayOrder: (get().deptKPIs[deptId]?.[objectiveId] ?? []).length - 1,
        })
        // Replace tempId with real backend id
        set((state) => {
          const deptKPI = state.deptKPIs[deptId] ?? {}
          return {
            deptKPIs: {
              ...state.deptKPIs,
              [deptId]: {
                ...deptKPI,
                [objectiveId]: (deptKPI[objectiveId] ?? []).map((k) =>
                  k.id === tempId ? { ...k, id: kpi.id } : k
                ),
              },
            },
          }
        })
      } catch (e) {
        // Rollback on error
        set((state) => {
          const deptKPI = state.deptKPIs[deptId] ?? {}
          return {
            deptKPIs: {
              ...state.deptKPIs,
              [deptId]: {
                ...deptKPI,
                [objectiveId]: (deptKPI[objectiveId] ?? []).filter((k) => k.id !== tempId),
              },
            },
            error: e.message,
          }
        })
        console.error('createDepartmentKpi failed:', e)
        const { toast } = await import('../components/ui/toast.jsx')
        toast.error(e.message || 'Lỗi khi tạo KPI nhỏ')
      }
    } else if (strategyId && !isRealId) {
      // participation not yet synced to backend — rollback optimistic add
      set((state) => {
        const deptKPI = state.deptKPIs[deptId] ?? {}
        return {
          deptKPIs: {
            ...state.deptKPIs,
            [deptId]: {
              ...deptKPI,
              [objectiveId]: (deptKPI[objectiveId] ?? []).filter((k) => k.id !== tempId),
            },
          },
          error: 'Phòng ban chưa đăng ký tham gia thành công. Vui lòng thử lại.',
        }
      })
    }
  },

  updateKPI: async (deptId, objectiveId, kpiId, updates) => {
    // Optimistic update
    set((state) => {
      const deptKPI = state.deptKPIs[deptId] ?? {}
      return {
        deptKPIs: {
          ...state.deptKPIs,
          [deptId]: {
            ...deptKPI,
            [objectiveId]: (deptKPI[objectiveId] ?? []).map((k) =>
              k.id === kpiId ? { ...k, ...updates } : k
            ),
          },
        },
      }
    })
    // Skip API call if kpiId or participationId are still temporary
    if (String(kpiId).startsWith('temp-')) return
    const { strategyId } = useBscContextStore.getState()
    const participationId = (get().participations[deptId] ?? {})[objectiveId]
    if (!participationId || String(participationId).startsWith('temp-')) return
    fishboneService
      .updateDepartmentKpi(kpiId, {
        bscStrategyId: strategyId,
        finalStrategicObjectiveId: objectiveId,
        departmentId: deptId,
        departmentParticipationId: participationId,
        name: updates.name,
        description: updates.description ?? '',
        displayOrder: updates.displayOrder,
      })
      .catch(async (e) => {
        console.error(e)
        const { toast } = await import('../components/ui/toast.jsx')
        toast.error(e.message || 'Lỗi khi cập nhật KPI nhỏ')
      })
  },

  removeKPI: async (deptId, objectiveId, kpiId) => {
    set((state) => {
      const deptKPI = state.deptKPIs[deptId] ?? {}
      return {
        deptKPIs: {
          ...state.deptKPIs,
          [deptId]: {
            ...deptKPI,
            [objectiveId]: (deptKPI[objectiveId] ?? []).filter((k) => k.id !== kpiId),
          },
        },
      }
    })
    fishboneService.deleteDepartmentKpi(kpiId).catch(async (e) => {
      console.error(e)
      const { toast } = await import('../components/ui/toast.jsx')
      toast.error(e.message || 'Lỗi khi xóa KPI nhỏ')
    })
  },

  // ── Read helpers ──────────────────────────────────────────────────────────
  getObjectiveKPIs: (objectiveId) => {
    const { departments, deptKPIs, participations } = get()
    return departments
      .filter((d) => !!(participations[d.id] ?? {})[objectiveId])
      .flatMap((d) =>
        (deptKPIs[d.id]?.[objectiveId] ?? []).map((k) => ({
          ...k,
          deptId: d.id,
          deptName: d.name,
          deptColor: d.color,
        }))
      )
  },

  getDeptAllKPIs: (deptId) => {
    const { deptKPIs } = get()
    const deptMap = deptKPIs[deptId] ?? {}
    return Object.entries(deptMap).flatMap(([objectiveId, kpis]) =>
      kpis.map((k) => ({ ...k, objectiveId }))
    )
  },

  getAllKPIs: (objectives) => {
    const { departments, deptKPIs, participations } = get()
    return (objectives ?? []).flatMap((obj) =>
      departments
        .filter((d) => !!(participations[d.id] ?? {})[obj.id])
        .flatMap((d) =>
          (deptKPIs[d.id]?.[obj.id] ?? []).map((k) => ({
            ...k,
            objectiveId: obj.id,
            objectiveName: obj.name,
            perspective: obj.perspective,
            deptId: d.id,
            deptName: d.name,
            deptColor: d.color,
          }))
        )
    )
  },

  // ── Validate ──────────────────────────────────────────────────────────────
  validate: (objectives) => {
    const state = get()
    const errors = []
    ;(objectives ?? []).forEach((obj) => {
      const depts = state.departments.filter((d) => !!(state.participations[d.id] ?? {})[obj.id])
      if (depts.length === 0) errors.push(`Mục tiêu "${obj.name}" chưa có phòng ban nào tham gia`)
      depts.forEach((d) => {
        const kpis = (state.deptKPIs[d.id]?.[obj.id] ?? []).filter((k) => k.name.trim())
        if (kpis.length === 0) errors.push(`${d.name} tham gia "${obj.name}" nhưng chưa tạo KPI`)
      })
    })
    return errors
  },

  // ── Fetch full fishbone state from backend on page load ───────────────────
  fetchFromBackend: async (strategyId) => {
    if (!strategyId) return
    set({ loading: true, error: null })
    try {
      const data = await fishboneService.getCompanyFishbone(strategyId)
      const newParticipations = {}
      const newDeptKPIs = {}

      for (const obj of (data.objectives ?? [])) {
        const objectiveId = obj.finalStrategicObjectiveId
        for (const p of (obj.participations ?? [])) {
          const deptId = p.departmentId
          if (!newParticipations[deptId]) newParticipations[deptId] = {}
          newParticipations[deptId][objectiveId] = p.id
        }
        for (const kpi of (obj.departmentKpis ?? [])) {
          const deptId = kpi.departmentId
          if (!newDeptKPIs[deptId]) newDeptKPIs[deptId] = {}
          if (!newDeptKPIs[deptId][objectiveId]) newDeptKPIs[deptId][objectiveId] = []
          newDeptKPIs[deptId][objectiveId].push({
            id: kpi.id,
            name: kpi.name,
            description: kpi.description ?? '',
          })
        }
      }

      set({ participations: newParticipations, deptKPIs: newDeptKPIs, loading: false })
    } catch (e) {
      set({ loading: false, error: e.message })
    }
  },

  // ── Complete B5 ───────────────────────────────────────────────────────────
  complete: async (objectives) => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validate(objectives)
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      await fishboneService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B5')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },
}))
