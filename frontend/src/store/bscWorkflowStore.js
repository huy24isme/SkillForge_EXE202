import { create } from 'zustand'
import bscStrategyService from '../services/bscStrategyService.js'

// Map backend BscStepCode → frontend step key
const STEP_CODE_MAP = {
  B1_ASSESSMENT:       'B1',
  B2_STRATEGY_BUILDING:'B2',
  B3_STRATEGY_RESULT:  'B3',
  B4_STRATEGY_MAP:     'B4',
  B5_FISHBONE:         'B5',
  B6_WEIGHT_ALLOCATION:'B6',
  B7_MEASUREMENT_TARGET:'B7',
  B8_ACTION_PLAN:      'B8',
}

const STEP_LABELS = {
  B1: 'Đánh giá',
  B2: 'Xây dựng Chiến lược',
  B3: 'Kết quả chiến lược',
  B4: 'Bản đồ Chiến lược',
  B5: 'Mô hình Xương cá',
  B6: 'Phân bổ Tỉ trọng',
  B7: 'Đo lường & Chỉ tiêu',
  B8: 'Action Plan',
}

// Backend BscStepStatusValue → frontend status
const mapStatus = (backendStatus) => {
  if (!backendStatus) return 'pending'
  const s = String(backendStatus).toUpperCase()
  if (s === 'COMPLETED') return 'completed'
  if (s === 'IN_PROGRESS') return 'active'
  return 'pending'
}

const makeInitialSteps = () =>
  Object.fromEntries(
    Object.values(STEP_CODE_MAP).map((key) => [
      key,
      { status: 'pending', completedAt: null, label: STEP_LABELS[key] },
    ])
  )

export const useBSCWorkflowStore = create((set, get) => ({
  steps: makeInitialSteps(),
  loading: false,

  // Load step statuses from backend
  fetchSteps: async (strategyId) => {
    if (!strategyId) return
    set({ loading: true })
    try {
      const stepList = await bscStrategyService.listSteps(strategyId)
      const newSteps = makeInitialSteps()
      ;(stepList || []).forEach((s) => {
        const key = STEP_CODE_MAP[s.stepCode]
        if (key) {
          newSteps[key] = {
            status: mapStatus(s.status),
            completedAt: s.completedAt ?? null,
            label: STEP_LABELS[key],
          }
        }
      })
      set({ steps: newSteps, loading: false })
    } catch {
      set({ loading: false })
    }
  },

  // Mark a step complete locally (called after the service complete API succeeds)
  markStepComplete: (stepId) =>
    set((state) => ({
      steps: {
        ...state.steps,
        [stepId]: {
          ...state.steps[stepId],
          status: 'completed',
          completedAt: new Date().toISOString().split('T')[0],
        },
      },
    })),

  markStepActive: (stepId) =>
    set((state) => ({
      steps: {
        ...state.steps,
        [stepId]: { ...state.steps[stepId], status: 'active' },
      },
    })),

  getCompletedCount: () =>
    Object.values(get().steps).filter((s) => s.status === 'completed').length,

  getStepStatus: (stepId) => get().steps[stepId]?.status ?? 'pending',
}))
