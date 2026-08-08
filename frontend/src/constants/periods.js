export const CURRENT_YEAR = 2024

export const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  id: `T${String(i + 1).padStart(2, '0')}-${CURRENT_YEAR}`,
  label: `Tháng ${i + 1}/${CURRENT_YEAR}`,
  short: `T${i + 1}`,
  month: i + 1,
  year: CURRENT_YEAR,
  type: 'monthly',
}))

export const QUARTERS = [1, 2, 3, 4].map(q => ({
  id: `Q${q}-${CURRENT_YEAR}`,
  label: `Quý ${q}/${CURRENT_YEAR}`,
  short: `Q${q}`,
  quarter: q,
  year: CURRENT_YEAR,
  type: 'quarterly',
}))

export const YEARLY = [{
  id: `NAM-${CURRENT_YEAR}`,
  label: `Năm ${CURRENT_YEAR}`,
  short: `${CURRENT_YEAR}`,
  year: CURRENT_YEAR,
  type: 'yearly',
}]

export const ALL_PERIODS = [...MONTHS, ...QUARTERS, ...YEARLY]

export const DEFAULT_PERIOD = MONTHS[0].id
