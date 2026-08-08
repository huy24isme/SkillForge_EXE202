import { create } from 'zustand'

export const useStrategyStore = create((set, get) => ({
  strategySets: [],
  activeStrategyId: null,
  selectedObjectiveId: null,

  getActiveStrategy: () => {
    const { strategySets, activeStrategyId } = get()
    return strategySets.find((s) => s.id === activeStrategyId) ?? strategySets[0] ?? null
  },

  setActiveStrategy: (id) => set({ activeStrategyId: id, selectedObjectiveId: null }),
  selectObjective: (id) => set({ selectedObjectiveId: id }),
  clearSelection: () => set({ selectedObjectiveId: null }),

  updateObjectivePosition: (id, position) =>
    set((s) => ({
      strategySets: s.strategySets.map((ss) =>
        ss.id === s.activeStrategyId
          ? { ...ss, objectives: ss.objectives.map((o) => (o.id === id ? { ...o, position } : o)) }
          : ss
      ),
    })),

  addStrategy: (name, description, color) =>
    set((s) => {
      const newId = `strategy-${Date.now()}`
      const idx = s.strategySets.length + 1
      return {
        strategySets: [
          ...s.strategySets,
          {
            id: newId,
            name: name || `Chiến lược ${idx}`,
            description: description || '',
            color: color || '#16a34a',
            objectives: [],
            links: [],
          },
        ],
        activeStrategyId: newId,
      }
    }),

  renameStrategy: (id, name) =>
    set((s) => ({
      strategySets: s.strategySets.map((ss) => (ss.id === id ? { ...ss, name } : ss)),
    })),

  deleteStrategy: (id) =>
    set((s) => {
      const remaining = s.strategySets.filter((ss) => ss.id !== id)
      return {
        strategySets: remaining,
        activeStrategyId:
          remaining.length > 0
            ? s.activeStrategyId === id
              ? remaining[0].id
              : s.activeStrategyId
            : null,
        selectedObjectiveId: null,
      }
    }),
}))
