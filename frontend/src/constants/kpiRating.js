export const RATINGS = {
  excellent: { id: 'excellent', min: 110, label: 'Xuất sắc', color: '#16a34a', bg: '#dcfce7', tailwind: 'bg-green-100 text-green-800' },
  good:      { id: 'good',      min: 90,  label: 'Tốt',       color: '#2563eb', bg: '#dbeafe', tailwind: 'bg-blue-100 text-blue-800' },
  average:   { id: 'average',   min: 70,  label: 'Trung bình', color: '#d97706', bg: '#fef3c7', tailwind: 'bg-yellow-100 text-yellow-800' },
  below:     { id: 'below',     min: 0,   label: 'Yếu',        color: '#dc2626', bg: '#fee2e2', tailwind: 'bg-red-100 text-red-800' },
}

export function getRating(pct) {
  if (pct >= 110) return RATINGS.excellent
  if (pct >= 90)  return RATINGS.good
  if (pct >= 70)  return RATINGS.average
  return RATINGS.below
}

export function calcCompletion(actual, target) {
  if (!target || target === 0) return 0
  return Math.round((actual / target) * 1000) / 10
}
