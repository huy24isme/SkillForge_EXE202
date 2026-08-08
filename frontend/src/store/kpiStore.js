import { create } from 'zustand'
import { mockKPIs } from '../data/mockKPIs.js'
import { mockKPIResults } from '../data/mockKPIResults.js'

let resultIdCounter = 10000

export const useKPIStore = create((set, get) => ({
  kpis: [...mockKPIs],
  results: [...mockKPIResults],

  // KPI CRUD
  addKPI: (kpi) => set(s => ({ kpis: [...s.kpis, kpi] })),
  updateKPI: (id, changes) => set(s => ({ kpis: s.kpis.map(k => k.id === id ? { ...k, ...changes } : k) })),
  deleteKPI: (id) => set(s => ({
    kpis: s.kpis.filter(k => k.id !== id && k.parentId !== id),
  })),

  // Results (actual value entry)
  setActualValue: (kpiId, period, actualValue, note = '') => {
    set(s => {
      const existing = s.results.find(r => r.kpiId === kpiId && r.period === period)
      if (existing) {
        return { results: s.results.map(r => r.kpiId === kpiId && r.period === period ? { ...r, actualValue, note } : r) }
      }
      return {
        results: [...s.results, {
          id: `r-new-${++resultIdCounter}`, kpiId, period, actualValue, note,
          enteredBy: 'usr-000', enteredAt: new Date().toISOString().split('T')[0],
        }],
      }
    })
  },

  getResult: (kpiId, period) => get().results.find(r => r.kpiId === kpiId && r.period === period),

  getResultsForPeriod: (period) => get().results.filter(r => r.period === period),
}))
