import { getRating, calcCompletion } from '../constants/kpiRating.js'

export { getRating, calcCompletion }

export function getKPIEvaluation(kpi, period, results) {
  const result = results.find(r => r.kpiId === kpi.id && r.period === period)
  const target = kpi.targetValues?.[period]
  if (!result || target == null) return null

  const actual = result.actualValue
  // For "lower is better" KPIs (error rate, cycle time, turnover), invert
  const lowerIsBetter = kpi.lowerIsBetter ?? false
  const rawPct = calcCompletion(actual, target)
  const completionPct = lowerIsBetter ? calcCompletion(target, actual) * 100 / 100 : rawPct
  const rating = getRating(completionPct)

  return { kpiId: kpi.id, period, target, actual, completionPct, rating, note: result.note }
}
