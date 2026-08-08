import { create } from 'zustand'

// B7 measurement configuration per KPI
// configs key = departmentKpiId (backend UUID)
// config: { unit, baselineValue, targetValue, direction, frequency, formulaDescription, greenThreshold, yellowThreshold, redThreshold, reportOwnerId }

export const useKPIMeasureStore = create((set, get) => ({
  // { [departmentKpiId]: { unit, baselineValue, targetValue, direction, frequency, formulaDescription, greenThreshold, yellowThreshold, redThreshold } }
  configs: {},

  loading: false,
  saving: false,
  error: null,

  // ── Local state helpers ───────────────────────────────────────

  setConfig: (kpiId, cfg) => set((s) => ({
    configs: { ...s.configs, [kpiId]: { ...s.configs[kpiId], ...cfg } },
  })),

  getConfig: (kpiId) => get().configs[kpiId] ?? null,

  isConfigured: (kpiId) => {
    const cfg = get().configs[kpiId]
    return !!(cfg?.unit && cfg?.targetValue)
  },

  getConfiguredCount: (kpiIds) => {
    const { configs } = get()
    return kpiIds.filter((id) => configs[id]?.unit && configs[id]?.targetValue).length
  },

  // ── API Integration ───────────────────────────────────────────

  // Load all measurements from backend → populate configs
  fetchMeasurements: async (strategyId) => {
    if (!strategyId) return
    const { default: measurementService } = await import('../services/measurementService.js')
    set({ loading: true, error: null })
    try {
      const list = await measurementService.getMeasurements(strategyId)
      // list: [{ departmentKpiId, unit, baselineValue, targetValue, direction, reportingFrequency,
      //           formulaDescription, greenThreshold, yellowThreshold, redThreshold, ... }]
      const configs = {}
      ;(list || []).forEach((m) => {
        configs[m.departmentKpiId] = {
          unit: m.unit ?? '',
          baselineValue: m.baselineValue != null ? String(m.baselineValue) : '',
          targetValue: m.targetValue != null ? String(m.targetValue) : '',
          direction: m.direction ?? 'HIGHER_IS_BETTER',
          frequency: m.reportingFrequency ?? 'MONTHLY',
          formulaDescription: m.formulaDescription ?? '',
          greenThreshold: m.greenThreshold ?? 90,
          yellowThreshold: m.yellowThreshold ?? 70,
          redThreshold: m.redThreshold ?? 0,
          reportOwnerId: m.reportOwnerId ?? null,
        }
      })
      set({ configs, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // Save single KPI measurement to backend (PUT upsert)
  saveMeasurement: async (departmentKpiId) => {
    const cfg = get().configs[departmentKpiId]
    if (!cfg) return
    const { default: measurementService } = await import('../services/measurementService.js')
    set({ saving: true, error: null })
    try {
      await measurementService.upsertMeasurement(departmentKpiId, {
        unit: cfg.unit,
        baselineValue: cfg.baselineValue !== '' ? Number(cfg.baselineValue) : undefined,
        targetValue: Number(cfg.targetValue),
        direction: cfg.direction,
        reportingFrequency: cfg.frequency,
        formulaDescription: cfg.formulaDescription || undefined,
        greenThreshold: cfg.greenThreshold ?? 90,
        yellowThreshold: cfg.yellowThreshold ?? 70,
        redThreshold: cfg.redThreshold ?? 0,
        reportOwnerId: cfg.reportOwnerId || undefined,
      })
      set({ saving: false })
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  // Save all configured KPIs to backend then complete B7
  complete: async (strategyId, allKpiIds) => {
    if (!strategyId) throw new Error('Chưa có chiến lược')
    const { default: measurementService } = await import('../services/measurementService.js')
    const { useBSCWorkflowStore } = await import('./bscWorkflowStore.js')
    const { configs } = get()

    set({ saving: true, error: null })
    try {
      // Save all configured measurements in parallel
      const savePromises = allKpiIds
        .filter((id) => configs[id]?.unit && configs[id]?.targetValue)
        .map((id) => get().saveMeasurement(id))
      await Promise.all(savePromises)

      // Complete B7
      await measurementService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B7')
      set({ saving: false })
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },
}))
