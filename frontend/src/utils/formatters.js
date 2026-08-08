const viVN = new Intl.NumberFormat('vi-VN')
const viVNCurrency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export function formatNumber(n) {
  if (n == null) return '—'
  return viVN.format(n)
}

export function formatPercent(n, decimals = 1) {
  if (n == null) return '—'
  return `${n.toFixed(decimals)}%`
}

export function formatCurrency(n) {
  if (n == null) return '—'
  return viVNCurrency.format(n * 1_000_000_000)
}

export function formatValue(value, unit) {
  if (value == null) return '—'
  return `${formatNumber(value)} ${unit}`
}
