import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import bscStrategyService from '../services/bscStrategyService.js'
import { useAuthStore } from './authStore.js'

export const useBscContextStore = create(
  persist(
    (set, get) => ({
      companyId: null,
      strategyId: null,
      loading: false,
      error: null,

      /**
       * Called after login — uses companyId from JWT user info.
       * Creates a BSC strategy for this year if none exists yet,
       * otherwise reuses the persisted strategyId.
       */
      init: async () => {
        const { loading } = get()
        if (loading) return

        // Get companyId from the authenticated user (JWT)
        const authUser = useAuthStore.getState().user
        const companyId = authUser?.companyId ?? get().companyId
        if (!companyId) {
          set({ error: 'Không tìm thấy thông tin công ty. Vui lòng đăng nhập lại.' })
          return
        }

        // Persist companyId from JWT
        if (companyId !== get().companyId) {
          set({ companyId })
        }

        const { strategyId } = get()
        if (strategyId) {
          // Verify the strategy still exists
          try {
            await bscStrategyService.getById(strategyId)
          } catch {
            // Strategy gone — clear and re-init
            set({ strategyId: null, error: null })
            return await get().init()
          }
          return
        }

        // Only CEO can create a new BSC strategy
        if (authUser?.role !== 'CEO') {
          return
        }

        // Create a new BSC strategy for the current year
        set({ loading: true, error: null })
        try {
          const year = new Date().getFullYear()
          const strategy = await bscStrategyService.create(companyId, {
            name: `Chiến lược BSC ${year}`,
            description: `Kế hoạch BSC năm ${year}`,
            year,
          })
          set({ strategyId: strategy.id, loading: false })
        } catch (e) {
          set({ error: e.message, loading: false })
        }
      },

      // Allow manual override (e.g. admin selects an existing strategy)
      setStrategyId: (id) => set({ strategyId: id }),
      setCompanyId: (id) => set({ companyId: id }),
      reset: () => set({ companyId: null, strategyId: null, error: null }),
      // Convenience: true when strategyId is set and not loading
      isReady: () => !!get().strategyId && !get().loading,
    }),
    {
      name: 'bsc-context',
      partialize: (s) => ({ companyId: s.companyId, strategyId: s.strategyId }),
    }
  )
)
