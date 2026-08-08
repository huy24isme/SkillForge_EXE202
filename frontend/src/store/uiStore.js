import { create } from 'zustand'

export const useUIStore = create(set => ({
  sidebarCollapsed: false,
  activePeriod: 'T01-2024',
  activePeriodType: 'monthly',
  selectedDept: null,

  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setActivePeriod: (period, type) => set({ activePeriod: period, activePeriodType: type }),
  setSelectedDept: dept => set({ selectedDept: dept }),
}))
