import { create } from 'zustand'

const DEFAULT_PERSPECTIVE_WEIGHTS = {
  FINANCIAL: 40,
  CUSTOMER: 30,
  INTERNAL_PROCESS: 20,
  LEARNING_AND_GROWTH: 10,
}

export const useWeightStore = create((set, get) => ({
  perspectiveWeights: { ...DEFAULT_PERSPECTIVE_WEIGHTS },
  objectiveWeights: {}, // { [objId]: absoluteWeight }
  kpiWeights: {},       // { [kpiId]: absoluteWeight }

  loading: false,
  saving: false,
  error: null,

  setPerspectiveWeight: (perspId, value) => set((state) => ({
    perspectiveWeights: {
      ...state.perspectiveWeights,
      [perspId]: Math.max(0, Math.min(100, Number(value) || 0)),
    },
  })),

  setObjectiveWeight: (objId, value) => set((state) => ({
    objectiveWeights: {
      ...state.objectiveWeights,
      [objId]: Math.max(0, Number(value) || 0),
    },
  })),

  setKpiWeight: (kpiId, value) => set((state) => ({
    kpiWeights: {
      ...state.kpiWeights,
      [kpiId]: Math.max(0, Number(value) || 0),
    },
  })),

  // Evenly distribute perspective weight across uninitialized objectives
  initObjectiveWeights: (objectives) => set((state) => {
    const weights = { ...state.objectiveWeights }
    const perspWt = state.perspectiveWeights
    const byPersp = {}
    objectives.forEach((o) => {
      if (!byPersp[o.perspective]) byPersp[o.perspective] = []
      byPersp[o.perspective].push(o)
    })
    Object.entries(byPersp).forEach(([perspId, objs]) => {
      const uninit = objs.filter((o) => weights[o.id] === undefined)
      if (uninit.length === 0) return
      const target = perspWt[perspId] ?? 0
      const n = objs.length
      const share = Math.floor(target / n)
      let remaining = target - share * (n - uninit.length)
      uninit.forEach((o, i) => {
        weights[o.id] = i === uninit.length - 1 ? remaining : share
        if (i < uninit.length - 1) remaining -= share
      })
    })
    return { objectiveWeights: weights }
  }),

  // Evenly distribute objective weight across uninitialized KPIs
  initKpiWeights: (allKpis) => set((state) => {
    const weights = { ...state.kpiWeights }
    const objWt = state.objectiveWeights
    const byObj = {}
    allKpis.forEach((k) => {
      if (!byObj[k.objectiveId]) byObj[k.objectiveId] = []
      byObj[k.objectiveId].push(k)
    })
    Object.entries(byObj).forEach(([objId, kpis]) => {
      const uninit = kpis.filter((k) => weights[k.id] === undefined)
      if (uninit.length === 0) return
      const target = objWt[objId] ?? 0
      const n = kpis.length
      const share = Math.floor(target / n)
      let remaining = target - share * (n - uninit.length)
      uninit.forEach((k, i) => {
        weights[k.id] = i === uninit.length - 1 ? remaining : share
        if (i < uninit.length - 1) remaining -= share
      })
    })
    return { kpiWeights: weights }
  }),

  resetToDefault: () => set({
    perspectiveWeights: { ...DEFAULT_PERSPECTIVE_WEIGHTS },
    objectiveWeights: {},
    kpiWeights: {},
  }),

  // ── API Integration ───────────────────────────────────────────

  // Load weight tree from backend → populate local state
  fetchWeightTree: async (strategyId) => {
    if (!strategyId) return
    const { default: weightService } = await import('../services/weightService.js')
    set({ loading: true, error: null })
    try {
      const tree = await weightService.getWeightTree(strategyId)
      // Response: { perspectives: [{ perspectiveCode, weightPercent, objectives: [{ finalStrategicObjectiveId, weightPercent, kpis: [{ departmentKpiId, weightPercent }] }] }] }
      const perspWts = {}
      const objWts = {}
      const kpiWts = {}
      ;(tree?.perspectives || []).forEach((p) => {
        perspWts[p.perspectiveCode] = Number(p.weightPercent) || 0
        ;(p.objectives || []).forEach((o) => {
          objWts[o.finalStrategicObjectiveId] = Number(o.weightPercent) || 0
          ;(o.kpis || []).forEach((k) => {
            kpiWts[k.departmentKpiId] = Number(k.weightPercent) || 0
          })
        })
      })
      set({
        perspectiveWeights: Object.keys(perspWts).length > 0 ? perspWts : { ...DEFAULT_PERSPECTIVE_WEIGHTS },
        objectiveWeights: objWts,
        kpiWeights: kpiWts,
        loading: false,
      })
    } catch {
      // Weight tree may not exist yet — keep defaults
      set({ loading: false })
    }
  },

  // Push all 3 weight tiers to backend
  saveAll: async (strategyId, { objectives, allKpis }) => {
    if (!strategyId) return
    const { default: weightService } = await import('../services/weightService.js')
    const { perspectiveWeights, objectiveWeights, kpiWeights } = get()
    set({ saving: true, error: null })
    try {
      const perspItems = Object.entries(perspectiveWeights).map(([perspectiveCode, weightPercent]) => ({
        perspectiveCode,
        weightPercent,
      }))
      const objItems = (objectives || []).map((o) => ({
        finalStrategicObjectiveId: o.id,
        perspectiveCode: o.perspective,
        weightPercent: objectiveWeights[o.id] ?? 0,
      }))
      const kpiItems = (allKpis || []).map((k) => ({
        departmentKpiId: k.id,
        finalStrategicObjectiveId: k.objectiveId,
        departmentId: k.deptId,
        perspectiveCode: k.perspective,
        weightPercent: kpiWeights[k.id] ?? 0,
      }))

      await Promise.all([
        weightService.upsertPerspectiveWeights(strategyId, perspItems),
        ...(objItems.length > 0 ? [weightService.upsertObjectiveWeights(strategyId, objItems)] : []),
        ...(kpiItems.length > 0 ? [weightService.upsertKpiWeights(strategyId, kpiItems)] : []),
      ])
      set({ saving: false })
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  // Save + complete B6
  complete: async (strategyId, { objectives, allKpis }) => {
    const { default: weightService } = await import('../services/weightService.js')
    const { useBscContextStore } = await import('./bscContextStore.js')
    const { useBSCWorkflowStore } = await import('./bscWorkflowStore.js')
    const sid = strategyId || useBscContextStore.getState().strategyId
    if (!sid) throw new Error('Chưa có chiến lược')
    await get().saveAll(sid, { objectives, allKpis })
    await weightService.complete(sid)
    useBSCWorkflowStore.getState().markStepComplete('B6')
  },
}))
