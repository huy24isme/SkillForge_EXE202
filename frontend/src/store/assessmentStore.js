import { create } from 'zustand'
import assessmentService from '../services/assessmentService.js'
import { useBscContextStore } from './bscContextStore.js'
import { useBSCWorkflowStore } from './bscWorkflowStore.js'

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

// ── Backend response → local state ────────────────────────────────────────────

const mapResponse = (response) => {
  if (!response) return {}

  const mapMarket = (items, periodType) =>
    (items || [])
      .filter((i) => i.periodType === periodType)
      .map((i) => ({
        id: uid(),
        name: i.companyName || '',
        percentage: Number(i.marketSharePercent) || 0,
        isOwn: !!i.ownCompany,
      }))

  const mapText = (items, category) =>
    (items || [])
      .filter((i) => i.category === category)
      .map((i) => ({ id: uid(), value: i.content || '' }))

  const financials = response.financials || []
  const marketShares = response.marketShares || []
  const textItems = response.textItems || []

  return {
    financial: financials.map((f) => ({
      id: uid(),
      year: f.year,
      revenue: Number(f.revenue) || 0,
      profit: Number(f.profit) || 0,
    })),
    marketShareCurrent: mapMarket(marketShares, 'CURRENT'),
    marketShareFuture: mapMarket(marketShares, 'FUTURE'),
    currentSegments:       mapText(textItems, 'CURRENT_SEGMENT'),
    futureSegments:        mapText(textItems, 'FUTURE_SEGMENT'),
    currentProducts:       mapText(textItems, 'CURRENT_CORE_PRODUCT'),
    futureProducts:        mapText(textItems, 'FUTURE_CORE_PRODUCT'),
    companyStrengths:      mapText(textItems, 'COMPANY_STRENGTH'),
    industrySuccessFactors:mapText(textItems, 'INDUSTRY_SUCCESS_FACTOR'),
    competitorStrengths:   mapText(textItems, 'COMPETITOR_STRENGTH'),
    competitorWeaknesses:  mapText(textItems, 'COMPETITOR_WEAKNESS'),
    competitiveAdvantages: mapText(textItems, 'COMPETITIVE_ADVANTAGE'),
  }
}

// ── Local state → backend request bodies ─────────────────────────────────────

const toFinancialItems = (financial) =>
  financial.map((f) => ({
    year: Number(f.year),
    revenue: Number(f.revenue),
    profit: Number(f.profit),
  }))

const toMarketShareItems = (current, future) => [
  ...current.map((e, i) => ({
    periodType: 'CURRENT',
    companyName: e.name || 'Unknown',
    marketSharePercent: Number(e.percentage) || 0,
    ownCompany: !!e.isOwn,
    displayOrder: i,
  })),
  ...future.map((e, i) => ({
    periodType: 'FUTURE',
    companyName: e.name || 'Unknown',
    marketSharePercent: Number(e.percentage) || 0,
    ownCompany: !!e.isOwn,
    displayOrder: i,
  })),
]

const TEXT_CATEGORY_MAP = [
  ['currentSegments',       'CURRENT_SEGMENT'],
  ['futureSegments',        'FUTURE_SEGMENT'],
  ['currentProducts',       'CURRENT_CORE_PRODUCT'],
  ['futureProducts',        'FUTURE_CORE_PRODUCT'],
  ['companyStrengths',      'COMPANY_STRENGTH'],
  ['industrySuccessFactors','INDUSTRY_SUCCESS_FACTOR'],
  ['competitorStrengths',   'COMPETITOR_STRENGTH'],
  ['competitorWeaknesses',  'COMPETITOR_WEAKNESS'],
  ['competitiveAdvantages', 'COMPETITIVE_ADVANTAGE'],
]

const toTextItems = (state) =>
  TEXT_CATEGORY_MAP.flatMap(([field, category]) =>
    (state[field] || []).map((item, i) => ({
      category,
      content: item.value,
      displayOrder: i,
    }))
  )

// ── Initial state ─────────────────────────────────────────────────────────────

const INITIAL = {
  financial: [],
  marketShareCurrent: [],
  marketShareFuture: [],
  currentSegments: [],
  futureSegments: [],
  currentProducts: [],
  futureProducts: [],
  companyStrengths: [],
  industrySuccessFactors: [],
  competitorStrengths: [],
  competitorWeaknesses: [],
  competitiveAdvantages: [],
  loading: false,
  saving: false,
  error: null,
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAssessmentStore = create((set, get) => ({
  ...INITIAL,

  // Load existing assessment from backend
  fetch: async (strategyId) => {
    if (!strategyId) return
    set({ loading: true, error: null })
    try {
      const response = await assessmentService.get(strategyId)
      set({ ...mapResponse(response), loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // ── Financial ──────────────────────────────────────────────────────────────
  addFinancialYear: (year, revenue, profit) =>
    set((state) => ({
      financial: [
        ...state.financial,
        { id: uid(), year: Number(year), revenue: Number(revenue), profit: Number(profit) },
      ],
    })),

  updateFinancialYear: (id, changes) =>
    set((state) => ({
      financial: state.financial.map((r) => (r.id === id ? { ...r, ...changes } : r)),
    })),

  removeFinancialYear: (id) =>
    set((state) => ({ financial: state.financial.filter((r) => r.id !== id) })),

  // ── Market share ───────────────────────────────────────────────────────────
  addMarketShareEntry: (type, entry) =>
    set((state) => {
      const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
      return { [key]: [...state[key], { id: uid(), name: '', percentage: 0, isOwn: false, ...entry }] }
    }),

  updateMarketShareEntry: (type, id, changes) =>
    set((state) => {
      const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
      return { [key]: state[key].map((r) => (r.id === id ? { ...r, ...changes } : r)) }
    }),

  removeMarketShareEntry: (type, id) =>
    set((state) => {
      const key = type === 'current' ? 'marketShareCurrent' : 'marketShareFuture'
      return { [key]: state[key].filter((r) => r.id !== id) }
    }),

  // ── Generic text lists ─────────────────────────────────────────────────────
  addListItem: (field, value) =>
    set((state) => ({
      [field]: [...state[field], { id: uid(), value: value.trim() }],
    })),

  updateListItem: (field, id, value) =>
    set((state) => ({
      [field]: state[field].map((r) => (r.id === id ? { ...r, value: value.trim() } : r)),
    })),

  removeListItem: (field, id) =>
    set((state) => ({ [field]: state[field].filter((r) => r.id !== id) })),

  // ── Validation ─────────────────────────────────────────────────────────────
  validate: () => {
    const s = get()
    const errors = []

    if (s.financial.length === 0) errors.push('Phần tài chính cần ít nhất 1 năm dữ liệu')
    if (s.financial.length > 3) errors.push('Phần tài chính không được vượt quá 3 năm')
    s.financial.forEach((r) => {
      if (r.revenue < 0) errors.push(`Năm ${r.year}: doanh thu không được âm`)
    })

    const totalCurrent = s.marketShareCurrent.reduce(
      (sum, r) => sum + (Number(r.percentage) || 0), 0
    )
    if (!s.marketShareCurrent.some((r) => r.isOwn))
      errors.push('Thị phần hiện tại: cần đánh dấu công ty của mình')
    if (Math.abs(totalCurrent - 100) > 0.01)
      errors.push(`Tổng thị phần hiện tại = ${totalCurrent}% (cần bằng 100%)`)

    const totalFuture = s.marketShareFuture.reduce(
      (sum, r) => sum + (Number(r.percentage) || 0), 0
    )
    if (!s.marketShareFuture.some((r) => r.isOwn))
      errors.push('Thị phần tương lai: cần đánh dấu công ty của mình')
    if (Math.abs(totalFuture - 100) > 0.01)
      errors.push(`Tổng thị phần tương lai = ${totalFuture}% (cần bằng 100%)`)

    const required = [
      ['currentSegments',       'Phân khúc hiện tại'],
      ['futureSegments',        'Phân khúc tương lai'],
      ['currentProducts',       'Sản phẩm chủ lực hiện tại'],
      ['futureProducts',        'Sản phẩm chủ lực tương lai'],
      ['companyStrengths',      'Điểm mạnh công ty'],
      ['industrySuccessFactors','Yếu tố thành công trong ngành'],
      ['competitorStrengths',   'Điểm mạnh đối thủ'],
      ['competitorWeaknesses',  'Điểm yếu đối thủ'],
      ['competitiveAdvantages', 'Lợi thế cạnh tranh'],
    ]
    required.forEach(([field, label]) => {
      if (s[field].length === 0) errors.push(`${label}: cần ít nhất 1 mục`)
    })

    return errors
  },

  // ── Save all to backend ────────────────────────────────────────────────────
  saveAll: async (strategyId) => {
    if (!strategyId) return
    const s = get()
    set({ saving: true, error: null })
    try {
      await Promise.all([
        assessmentService.upsertFinancials(strategyId, toFinancialItems(s.financial)),
        assessmentService.upsertMarketShares(
          strategyId,
          toMarketShareItems(s.marketShareCurrent, s.marketShareFuture)
        ),
        assessmentService.upsertTextItems(strategyId, toTextItems(s)),
      ])
      set({ saving: false })
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  // ── Complete B1 ────────────────────────────────────────────────────────────
  complete: async () => {
    // Ensure strategyId is available — re-init if not (handles timing race condition)
    let strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) {
      try {
        await useBscContextStore.getState().init()
        strategyId = useBscContextStore.getState().strategyId
      } catch {
        // ignore
      }
    }
    if (!strategyId) return ['Chưa khởi tạo chiến lược. Vui lòng đăng nhập lại.']

    const errs = get().validate()
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      await get().saveAll(strategyId)
      await assessmentService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B1')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },
}))
