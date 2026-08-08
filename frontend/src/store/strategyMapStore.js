import { create } from 'zustand'
import strategyMapService from '../services/strategyMapService.js'
import { useBscContextStore } from './bscContextStore.js'
import { useBSCWorkflowStore } from './bscWorkflowStore.js'
import { useSWOTStore } from './swotStore.js'
import { toast } from '../components/ui/toast.jsx'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

const PERSPECTIVE_KEYS = ['FINANCIAL', 'CUSTOMER', 'INTERNAL_PROCESS', 'LEARNING_AND_GROWTH']
const PERSPECTIVE_LABELS = {
  FINANCIAL: 'Tài chính',
  CUSTOMER: 'Khách hàng',
  INTERNAL_PROCESS: 'Quy trình nội bộ',
  LEARNING_AND_GROWTH: 'Học hỏi & phát triển',
}

export const useStrategyMapStore = create((set, get) => ({
  // strategyObjectives[candidateStrategyId] = [{id (backend UUID), name, description, perspective, order}]
  strategyObjectives: {},
  // strategyCausalLinks[candidateStrategyId] = [{id (backend UUID), sourceId, targetId}]
  strategyCausalLinks: {},
  // Map: candidateStrategyId → strategyMapId (backend UUID)
  strategyMapIds: {},

  // Final merged objectives (for 2-strategy case)
  finalObjectives: [],
  finalCausalLinks: [],
  // merge decisions: sourceObjId → 'keep' | 'remove' | 'merged:<finalId>'
  mergeDecisions: {},

  loading: false,
  saving: false,
  error: null,

  // ── Init: create strategy maps for each selected strategy ────────────────
  initForStrategies: async (strategyIds) => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return

    // candidateStrategyId → selectedStrategyId (UUID bảng selected_strategies)
    const b3SelectedIds = useSWOTStore.getState().b3SelectedIds ?? {}

    const { strategyMapIds } = get()
    const objs = { ...get().strategyObjectives }
    const links = { ...get().strategyCausalLinks }
    const newMapIds = { ...strategyMapIds }

    set({ loading: true })
    try {
      for (const candidateStratId of strategyIds) {
        if (!objs[candidateStratId]) objs[candidateStratId] = []
        if (!links[candidateStratId]) links[candidateStratId] = []

        if (!newMapIds[candidateStratId]) {
          // selectedStrategyId (UUID bảng selected_strategies) — BE yêu cầu
          const beSelectedStratId = b3SelectedIds[candidateStratId] ?? candidateStratId
          // Create INDIVIDUAL strategy map
          const map = await strategyMapService.createStrategyMap(strategyId, {
            selectedStrategyId: beSelectedStratId,
            mapType: 'INDIVIDUAL',
          })
          newMapIds[candidateStratId] = map.id
        }
      }
      set({
        strategyObjectives: objs,
        strategyCausalLinks: links,
        strategyMapIds: newMapIds,
        loading: false,
      })
    } catch (e) {
      set({ loading: false, error: e.message })
    }
  },

  // ── Objective CRUD ────────────────────────────────────────────────────────
  addObjective: async (candidateStratId, { name, description = '', perspective }) => {
    const { strategyMapIds } = get()
    const strategyMapId = strategyMapIds[candidateStratId]
    if (!strategyMapId) {
      console.error('[strategyMapStore] No strategyMapId found for candidateStratId:', candidateStratId, '\nstrategyMapIds:', strategyMapIds)
      return
    }

    // BE yêu cầu selectedStrategyId = UUID bảng selected_strategies
    const b3SelectedIds = useSWOTStore.getState().b3SelectedIds ?? {}
    const beSelectedStratId = b3SelectedIds[candidateStratId] ?? candidateStratId

    const tempId = `temp-${uid()}`
    // Optimistic add
    set((state) => ({
      strategyObjectives: {
        ...state.strategyObjectives,
        [candidateStratId]: [
          ...(state.strategyObjectives[candidateStratId] ?? []),
          { id: tempId, name: name.trim(), description: description.trim(), perspective, order: (state.strategyObjectives[candidateStratId] ?? []).length },
        ],
      },
    }))

    try {
      // Backend CreateStrategicObjectiveRequest requires selectedStrategyId (@NotNull)
      const obj = await strategyMapService.createObjective(strategyMapId, {
        selectedStrategyId: beSelectedStratId,
        name: name.trim(),
        description: description.trim(),
        perspectiveCode: perspective,
        displayOrder: (get().strategyObjectives[candidateStratId] ?? []).length - 1,
      })
      // Replace tempId with real backend id
      set((state) => ({
        strategyObjectives: {
          ...state.strategyObjectives,
          [candidateStratId]: (state.strategyObjectives[candidateStratId] ?? []).map((o) =>
            o.id === tempId ? { ...o, id: obj.id } : o
          ),
        },
      }))
    } catch (e) {
      // Rollback
      set((state) => ({
        strategyObjectives: {
          ...state.strategyObjectives,
          [candidateStratId]: (state.strategyObjectives[candidateStratId] ?? []).filter((o) => o.id !== tempId),
        },
        error: e.message,
      }))
      toast.error(e.message || 'Lỗi khi thêm mục tiêu')
    }
  },

  updateObjective: async (candidateStratId, objId, updates) => {
    // Optimistic local update
    set((state) => ({
      strategyObjectives: {
        ...state.strategyObjectives,
        [candidateStratId]: (state.strategyObjectives[candidateStratId] ?? []).map((o) =>
          o.id === objId ? { ...o, ...updates } : o
        ),
      },
    }))
    // BE yêu cầu selectedStrategyId = UUID bảng selected_strategies
    const b3SelectedIds = useSWOTStore.getState().b3SelectedIds ?? {}
    const beSelectedStratId = b3SelectedIds[candidateStratId] ?? candidateStratId
    // Backend UpdateStrategicObjectiveRequest requires selectedStrategyId (@NotNull)
    strategyMapService
      .updateObjective(objId, {
        selectedStrategyId: beSelectedStratId,
        name: updates.name,
        description: updates.description ?? '',
        perspectiveCode: updates.perspective,
        displayOrder: updates.order,
      })
      .catch((e) => {
        console.error(e)
        toast.error(e.message || 'Lỗi khi cập nhật mục tiêu')
      })
  },

  removeObjective: async (selectedStratId, objId) => {
    // Optimistic remove
    set((state) => ({
      strategyObjectives: {
        ...state.strategyObjectives,
        [selectedStratId]: (state.strategyObjectives[selectedStratId] ?? []).filter((o) => o.id !== objId),
      },
      strategyCausalLinks: {
        ...state.strategyCausalLinks,
        [selectedStratId]: (state.strategyCausalLinks[selectedStratId] ?? []).filter(
          (l) => l.sourceId !== objId && l.targetId !== objId
        ),
      },
    }))
    strategyMapService.deleteObjective(objId).catch((e) => {
      console.error(e)
      toast.error(e.message || 'Lỗi khi xóa mục tiêu')
    })
  },

  // ── Causal Links ──────────────────────────────────────────────────────────
  addCausalLink: async (selectedStratId, sourceId, targetId) => {
    const { strategyCausalLinks, strategyMapIds } = get()
    const links = strategyCausalLinks[selectedStratId] ?? []
    if (sourceId === targetId) return
    if (links.some((l) => l.sourceId === sourceId && l.targetId === targetId)) return

    const strategyMapId = strategyMapIds[selectedStratId]
    if (!strategyMapId) return

    const tempId = `temp-${uid()}`
    set((state) => ({
      strategyCausalLinks: {
        ...state.strategyCausalLinks,
        [selectedStratId]: [...(state.strategyCausalLinks[selectedStratId] ?? []), { id: tempId, sourceId, targetId }],
      },
    }))

    try {
      const link = await strategyMapService.createObjectiveLink(strategyMapId, {
        sourceObjectiveId: sourceId,
        targetObjectiveId: targetId,
      })
      set((state) => ({
        strategyCausalLinks: {
          ...state.strategyCausalLinks,
          [selectedStratId]: (state.strategyCausalLinks[selectedStratId] ?? []).map((l) =>
            l.id === tempId ? { ...l, id: link.id } : l
          ),
        },
      }))
    } catch (e) {
      set((state) => ({
        strategyCausalLinks: {
          ...state.strategyCausalLinks,
          [selectedStratId]: (state.strategyCausalLinks[selectedStratId] ?? []).filter((l) => l.id !== tempId),
        },
        error: e.message,
      }))
      toast.error(e.message || 'Lỗi khi thêm liên kết')
    }
  },

  removeCausalLink: async (selectedStratId, linkId) => {
    set((state) => ({
      strategyCausalLinks: {
        ...state.strategyCausalLinks,
        [selectedStratId]: (state.strategyCausalLinks[selectedStratId] ?? []).filter((l) => l.id !== linkId),
      },
    }))
    strategyMapService.deleteObjectiveLink(linkId).catch((e) => {
      console.error(e)
      toast.error(e.message || 'Lỗi khi xóa liên kết')
    })
  },

  // ── Merge step (for 2-strategy case) ─────────────────────────────────────
  keepObjective: (selectedStratId, objId) => set((state) => {
    const obj = (state.strategyObjectives[selectedStratId] ?? []).find((o) => o.id === objId)
    if (!obj) return state
    const finalId = `final-${uid()}`
    const finalObj = { ...obj, id: finalId, type: 'ORIGINAL', sourceIds: [objId] }
    const existing = state.finalObjectives.filter((f) => !f.sourceIds.includes(objId))
    return {
      finalObjectives: [...existing, finalObj],
      mergeDecisions: { ...state.mergeDecisions, [objId]: 'keep' },
    }
  }),

  removeFromMerge: (objId) => set((state) => {
    const finalObjUsingIt = state.finalObjectives.find((f) => f.sourceIds.includes(objId))
    let newFinals = state.finalObjectives
    if (finalObjUsingIt && finalObjUsingIt.sourceIds.length <= 1) {
      newFinals = state.finalObjectives.filter((f) => f.id !== finalObjUsingIt.id)
    }
    return {
      finalObjectives: newFinals,
      mergeDecisions: { ...state.mergeDecisions, [objId]: 'remove' },
    }
  }),

  mergeObjectives: (sourceIds, { name, description = '', perspective }) => set((state) => {
    const finalId = `final-${uid()}`
    const finalObj = {
      id: finalId,
      name: name.trim(),
      description: description.trim(),
      perspective,
      type: 'MERGED',
      sourceIds,
      order: state.finalObjectives.length,
    }
    const existing = state.finalObjectives.filter((f) => !f.sourceIds.some((s) => sourceIds.includes(s)))
    const newDecisions = { ...state.mergeDecisions }
    sourceIds.forEach((id) => { newDecisions[id] = `merged-${finalId}` })
    return { finalObjectives: [...existing, finalObj], mergeDecisions: newDecisions }
  }),

  updateFinalObjective: (finalId, updates) => set((state) => ({
    finalObjectives: state.finalObjectives.map((f) =>
      f.id === finalId
        ? { ...f, ...updates, type: f.type === 'ORIGINAL' ? 'MANUAL_EDITED' : f.type }
        : f
    ),
  })),

  removeFinalObjective: (finalId) => set((state) => {
    const obj = state.finalObjectives.find((f) => f.id === finalId)
    const newDecisions = { ...state.mergeDecisions }
    if (obj) obj.sourceIds.forEach((sid) => { delete newDecisions[sid] })
    return {
      finalObjectives: state.finalObjectives.filter((f) => f.id !== finalId),
      mergeDecisions: newDecisions,
      finalCausalLinks: state.finalCausalLinks.filter(
        (l) => l.sourceId !== finalId && l.targetId !== finalId
      ),
    }
  }),

  addFinalCausalLink: (sourceId, targetId) => set((state) => {
    if (sourceId === targetId) return state
    if (state.finalCausalLinks.some((l) => l.sourceId === sourceId && l.targetId === targetId)) return state
    return { finalCausalLinks: [...state.finalCausalLinks, { id: uid(), sourceId, targetId }] }
  }),

  removeFinalCausalLink: (linkId) => set((state) => ({
    finalCausalLinks: state.finalCausalLinks.filter((l) => l.id !== linkId),
  })),

  // Return the "effective" final objectives for B5 input
  getEffectiveFinalObjectives: (b3Selected) => {
    const state = get()
    if (b3Selected.length === 1) {
      return (state.strategyObjectives[b3Selected[0]] ?? []).map((o) => ({
        ...o,
        type: 'ORIGINAL',
        sourceIds: [o.id],
      }))
    }
    return state.finalObjectives
  },

  // ── Validate ──────────────────────────────────────────────────────────────
  validate: (b3Selected) => {
    const state = get()
    const errors = []
    b3Selected.forEach((stratId) => {
      const objs = state.strategyObjectives[stratId] ?? []
      if (objs.length === 0) errors.push('Chưa có mục tiêu nào cho chiến lược này')
      if (objs.length > 12) errors.push('Mỗi chiến lược tối đa 12 mục tiêu')
      PERSPECTIVE_KEYS.forEach((p) => {
        if (!objs.some((o) => o.perspective === p))
          errors.push(`Mỗi chiến lược cần ít nhất 1 mục tiêu thuộc góc độ "${PERSPECTIVE_LABELS[p]}"`)
      })
    })
    if (b3Selected.length === 2) {
      if (state.finalObjectives.length === 0)
        errors.push('Cần thực hiện bước gộp bản đồ chiến lược')
      PERSPECTIVE_KEYS.forEach((p) => {
        if (!state.finalObjectives.some((f) => f.perspective === p))
          errors.push(`Bản đồ tổng thiếu góc độ "${PERSPECTIVE_LABELS[p]}"`)
      })
    }
    return errors
  },

  // ── Fetch from backend on page load ─────────────────────────────────────
  fetchFromBackend: async (strategyId) => {
    if (!strategyId) return
    set({ loading: true, error: null })
    try {
      const data = await strategyMapService.getFinalStrategyMap(strategyId)
      const newMapIds = {}
      const newObjs = {}
      const newLinks = {}

      for (const indMap of (data.individualStrategyMaps ?? [])) {
        // BE trả về candidateStrategyId trực tiếp — dùng làm key khớp với b3Selected
        const candidateId = indMap.candidateStrategyId ?? indMap.selectedStrategyId

        newMapIds[candidateId] = indMap.id
        newObjs[candidateId] = (indMap.objectives ?? []).map((o) => ({
          id: o.id,
          name: o.name,
          description: o.description ?? '',
          perspective: o.perspectiveCode,
          order: o.displayOrder ?? 0,
        }))
        newLinks[candidateId] = (indMap.objectiveLinks ?? []).map((l) => ({
          id: l.id,
          sourceId: l.sourceObjectiveId,
          targetId: l.targetObjectiveId,
        }))
      }

      const finalObjectives = (data.finalObjectives ?? []).map((fo) => ({
        id: fo.id,
        name: fo.name,
        description: fo.description ?? '',
        perspective: fo.perspectiveCode,
        type: fo.sourceType,
        sourceIds: (fo.sources ?? []).map((s) => s.sourceObjectiveId),
        order: fo.displayOrder ?? 0,
      }))

      const finalCausalLinks = (data.finalObjectiveLinks ?? []).map((l) => ({
        id: l.id,
        sourceId: l.sourceFinalObjectiveId,
        targetId: l.targetFinalObjectiveId,
      }))

      set({
        strategyMapIds: newMapIds,
        strategyObjectives: newObjs,
        strategyCausalLinks: newLinks,
        finalObjectives,
        finalCausalLinks,
        loading: false,
      })
    } catch (e) {
      set({ loading: false, error: e.message })
    }
  },

  // ── Complete B4 ───────────────────────────────────────────────────────────
  complete: async (b3Selected) => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validate(b3Selected)
    if (errs.length > 0) return errs

    // Guard: ensure all objectives have real backend IDs (not temp-xxx)
    const hasTempIds = b3Selected.some((sid) =>
      (get().strategyObjectives[sid] ?? []).some((o) => String(o.id).startsWith('temp-'))
    )
    if (hasTempIds) return ['Một số mục tiêu chưa được lưu thành công lên server. Vui lòng thử thêm lại các mục tiêu bị lỗi.']

    set({ saving: true, error: null })
    try {
      if (b3Selected.length === 1) {
        // Single strategy: BE always requires finalObjectives to be persisted via buildFinalObjectives
        // before calling complete(). Auto-build from individual objectives (all ORIGINAL).
        const candidateStratId = b3Selected[0]
        const objs = get().strategyObjectives[candidateStratId] ?? []
        const buildItems = objs.map((obj, idx) => ({
          name: obj.name,
          description: obj.description || '',
          perspectiveCode: obj.perspective,
          sourceType: 'ORIGINAL',
          sourceObjectiveIds: [obj.id],
          displayOrder: idx,
        }))
        await strategyMapService.buildFinalObjectives(strategyId, { items: buildItems })
        await strategyMapService.complete(strategyId)
      } else {
        // Two strategies: build final objectives from local merge state
        const { finalObjectives, finalCausalLinks } = get()

        const buildItems = finalObjectives.map((fo, idx) => ({
          name: fo.name,
          description: fo.description || '',
          perspectiveCode: fo.perspective,
          sourceType:
            fo.type === 'MERGED' ? 'MERGED'
            : fo.type === 'MANUAL_EDITED' ? 'MANUAL_EDITED'
            : 'ORIGINAL',
          sourceObjectiveIds: (fo.sourceIds ?? []).filter((id) => id && !String(id).startsWith('temp-')),
          displayOrder: idx,
        }))

        // buildFinalObjectives returns FinalStrategyMapResponse { finalObjectives[], ... }
        const builtResp = await strategyMapService.buildFinalObjectives(strategyId, { items: buildItems })
        const builtItems = builtResp?.finalObjectives || []

        // Map local finalId → backend id (matched by index, same order as buildItems)
        const localToBackend = {}
        builtItems.forEach((backendObj, idx) => {
          const localObj = finalObjectives[idx]
          if (localObj) localToBackend[localObj.id] = backendObj.id
        })

        // Create final causal links using real backend IDs
        for (const link of finalCausalLinks) {
          const srcId = localToBackend[link.sourceId] ?? link.sourceId
          const tgtId = localToBackend[link.targetId] ?? link.targetId
          await strategyMapService.createFinalObjectiveLink(strategyId, {
            sourceFinalObjectiveId: srcId,
            targetFinalObjectiveId: tgtId,
          }).catch(console.error)
        }

        await strategyMapService.complete(strategyId)
      }

      useBSCWorkflowStore.getState().markStepComplete('B4')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },
}))
