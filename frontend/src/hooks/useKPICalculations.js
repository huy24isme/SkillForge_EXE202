import { useMemo } from 'react'
import { useKPIStore } from '../store/kpiStore.js'
import { calcCompletion, getRating } from '../constants/kpiRating.js'
import { PERSPECTIVE_MAP } from '../constants/bsc.js'

export function useKPIEvaluation(kpiId, period) {
  const { kpis, results } = useKPIStore()
  return useMemo(() => {
    const kpi = kpis.find(k => k.id === kpiId)
    if (!kpi) return null
    const result = results.find(r => r.kpiId === kpiId && r.period === period)
    const target = kpi.targetValues?.[period]
    if (target == null) return { kpi, target: null, actual: result?.actualValue ?? null, completionPct: null, rating: null }
    if (!result) return { kpi, target, actual: null, completionPct: null, rating: null }
    const completionPct = calcCompletion(result.actualValue, target)
    return { kpi, target, actual: result.actualValue, completionPct, rating: getRating(completionPct), note: result.note }
  }, [kpis, results, kpiId, period])
}

export function usePerspectiveSummary(perspectiveId, period) {
  const { kpis, results } = useKPIStore()
  return useMemo(() => {
    const companyKPIs = kpis.filter(k => k.perspectiveId === perspectiveId && k.level === 'company')
    let totalWeight = 0, weightedSum = 0, evaluated = 0
    const items = companyKPIs.map(kpi => {
      const result = results.find(r => r.kpiId === kpi.id && r.period === period)
      const target = kpi.targetValues?.[period]
      if (!result || target == null) return { kpi, target, actual: null, completionPct: null, rating: null }
      const completionPct = calcCompletion(result.actualValue, target)
      const rating = getRating(completionPct)
      totalWeight += kpi.weight
      weightedSum += completionPct * kpi.weight
      evaluated++
      return { kpi, target, actual: result.actualValue, completionPct, rating }
    })
    const avgCompletion = totalWeight > 0 ? Math.round(weightedSum / totalWeight * 10) / 10 : null
    return { items, avgCompletion, evaluated, total: companyKPIs.length, perspective: PERSPECTIVE_MAP[perspectiveId] }
  }, [kpis, results, perspectiveId, period])
}

export function useDepartmentComparison(period) {
  const { kpis, results } = useKPIStore()
  return useMemo(() => {
    const deptMap = {}
    kpis.filter(k => k.level === 'department' || (k.level === 'company' && k.deptId !== 'dept-bgd')).forEach(kpi => {
      const deptId = kpi.deptId
      if (!deptMap[deptId]) deptMap[deptId] = { totalWeight: 0, weightedSum: 0 }
      const result = results.find(r => r.kpiId === kpi.id && r.period === period)
      const target = kpi.targetValues?.[period]
      if (result && target) {
        const pct = calcCompletion(result.actualValue, target)
        deptMap[deptId].totalWeight += kpi.weight
        deptMap[deptId].weightedSum += pct * kpi.weight
      }
    })
    return Object.entries(deptMap).map(([deptId, d]) => ({
      deptId,
      completionPct: d.totalWeight > 0 ? Math.round(d.weightedSum / d.totalWeight * 10) / 10 : null,
      rating: d.totalWeight > 0 ? getRating(d.weightedSum / d.totalWeight) : null,
    }))
  }, [kpis, results, period])
}
