import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import strategyBuildingService from '../services/strategyBuildingService.js'
import strategySelectionService from '../services/strategySelectionService.js'
import { useBscContextStore } from './bscContextStore.js'
import { useBSCWorkflowStore } from './bscWorkflowStore.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Date.now().toString(36) + Math.random().toString(36).slice(2, 5)

// Backend modelType → local store key
const MODEL_TYPE_TO_KEY = {
  SEVEN_S:    'sevenS',
  FIVE_FORCES:'fiveForces',
  PESTEL:     'pestel',
}
const MODEL_KEY_TO_TYPE = {
  sevenS:     'SEVEN_S',
  fiveForces: 'FIVE_FORCES',
  pestel:     'PESTEL',
}

// ── Build analysisItemsRaw from nested state ──────────────────────────────────

const buildAnalysisItems = (sevenS, fiveForces, pestel) => {
  const items = []
  const addGroup = (modelKey, group) => {
    const modelType = MODEL_KEY_TO_TYPE[modelKey]
    Object.entries(group).forEach(([factor, entries]) => {
      ;(entries || []).forEach((entry, idx) => {
        items.push({ id: entry.id, modelType, factorCode: factor, content: entry.value, displayOrder: idx })
      })
    })
  }
  addGroup('sevenS', sevenS)
  addGroup('fiveForces', fiveForces)
  addGroup('pestel', pestel)
  return items
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSWOTStore = create(
  persist(
    (set, get) => ({
      currentStrategyId: null,

      // Raw backend state (needed for ID mapping)
      analysisItemsRaw: [],
      swotItemsRaw: [],

      // Nested analysis items (for display, keeps page interface compatible)
      sevenS: {},
      fiveForces: {},
      pestel: {},

      // SWOT selections (arrays of sourceAnalysisItemId)
      swotS: [],
      swotW: [],
      swotO: [],
      swotT: [],

      // Candidate strategies (frontend-friendly format with backend IDs)
      strategies: [],

      // B3 selection
      b3Selected: [],   // [candidateStrategyId] — dùng để match với strategies[] cho UI
      b3Notes: {},
      // Map: candidateStrategyId → selectedStrategyId (UUID bảng selected_strategies, để gọi B4 API)
      b3SelectedIds: {},

      loading: false,
      saving: false,
      error: null,

      // ── Fetch B2 + B3 data ───────────────────────────────────────────────────
      fetch: async (strategyId) => {
        if (!strategyId) return

        // Clear local state if switching to a different strategy
        if (get().currentStrategyId !== strategyId) {
          set({
            currentStrategyId: strategyId,
            analysisItemsRaw: [],
            swotItemsRaw: [],
            sevenS: {}, fiveForces: {}, pestel: {},
            swotS: [], swotW: [], swotO: [], swotT: [],
            strategies: [], b3Selected: [], b3Notes: {}
          })
        }

        set({ loading: true, error: null })
        try {
          // ── Load candidates (the only B2 GET endpoint that exists) ──────────
          const rawCandidates = await strategyBuildingService.listCandidateStrategies(strategyId)
          const activeCandidates = (rawCandidates || []).filter((cs) => cs.status !== 'DELETED')

          // ── Merge analysisItemsRaw ──────────────────────────────────────────
          // Because backend lacks a GET endpoint for analysis items, we MUST retain
          // what the user typed locally (from persist). We merge backend data on top.
          const analysisMap = new Map()
          get().analysisItemsRaw.forEach((item) => analysisMap.set(item.id, item))

          const swotItemMap  = new Map()
          get().swotItemsRaw.forEach((item) => swotItemMap.set(item.id, item))

          activeCandidates.forEach((cs) => {
            ;(cs.swotItems || []).forEach((si) => {
              if (!analysisMap.has(si.sourceAnalysisItemId)) {
                analysisMap.set(si.sourceAnalysisItemId, {
                  id:           si.sourceAnalysisItemId,
                  modelType:    si.sourceModelType,
                  factorCode:   si.sourceFactorCode,
                  content:      si.contentSnapshot,
                  displayOrder: 0,
                })
              }
              if (!swotItemMap.has(si.swotItemId)) {
                swotItemMap.set(si.swotItemId, {
                  id:                  si.swotItemId,
                  swotType:            String(si.swotType),
                  sourceAnalysisItemId: si.sourceAnalysisItemId,
                })
              }
            })
          })
          // Use safe sync to heal any fake IDs
          try {
            const syncResp = await get()._safeSyncFromBackend()
            if (syncResp?.swotItems) {
              swotItemMap.clear()
              syncResp.swotItems.forEach((si) => {
                swotItemMap.set(si.id, {
                  id:                  si.id,
                  swotType:            String(si.swotType),
                  sourceAnalysisItemId: si.sourceAnalysisItemId,
                })
              })
            }
          } catch (syncErr) {
            console.error('Self-healing sync in fetch failed:', syncErr)
          }

          // Reload analysisMap after sync
          analysisMap.clear()
          get().analysisItemsRaw.forEach((item) => analysisMap.set(item.id, item))

          const analysisItemsRaw = [...analysisMap.values()]
          const swotItemsRaw     = [...swotItemMap.values()]

          // ── Reconstruct nested sevenS / fiveForces / pestel ───────────────────
          const sevenS = {}; const fiveForces = {}; const pestel = {}
          analysisItemsRaw.forEach((item) => {
            const key = MODEL_TYPE_TO_KEY[item.modelType]
            if (!key) return
            const target = { sevenS, fiveForces, pestel }[key]
            if (!target[item.factorCode]) target[item.factorCode] = []
            if (!target[item.factorCode].find((e) => e.id === item.id)) {
              target[item.factorCode].push({ id: item.id, value: item.content })
            }
          })

          // ── SWOT selections ────────────────────────────────────────────────────
          // Also merge with locally persisted selections (in case user selected SWOT but hasn't created a strategy)
          const localSwotS = new Set(get().swotS)
          const localSwotW = new Set(get().swotW)
          const localSwotO = new Set(get().swotO)
          const localSwotT = new Set(get().swotT)

          swotItemsRaw.forEach((i) => {
            if (i.swotType === 'S') localSwotS.add(i.sourceAnalysisItemId)
            if (i.swotType === 'W') localSwotW.add(i.sourceAnalysisItemId)
            if (i.swotType === 'O') localSwotO.add(i.sourceAnalysisItemId)
            if (i.swotType === 'T') localSwotT.add(i.sourceAnalysisItemId)
          })

          const swotS = [...localSwotS]
          const swotW = [...localSwotW]
          const swotO = [...localSwotO]
          const swotT = [...localSwotT]

          // ── Candidate strategies (frontend-friendly) ───────────────────────────
          const strategies = activeCandidates.map((cs) => ({
            id:          cs.id,
            type:        String(cs.strategyGroup),
            name:        cs.name,
            description: cs.description || '',
            sItems: (cs.swotItems || []).filter((si) => String(si.swotType) === 'S').map((si) => si.sourceAnalysisItemId),
            wItems: (cs.swotItems || []).filter((si) => String(si.swotType) === 'W').map((si) => si.sourceAnalysisItemId),
            oItem:  (cs.swotItems || []).find((si) => String(si.swotType) === 'O')?.sourceAnalysisItemId ?? null,
            tItem:  (cs.swotItems || []).find((si) => String(si.swotType) === 'T')?.sourceAnalysisItemId ?? null,
          }))

          // ── Load B3 selection ──────────────────────────────────────────────────
          let b3Selected = []
          let b3SelectedIds = {}
          try {
            const selectionResp = await strategySelectionService.get(strategyId)
            const sorted = ((selectionResp?.selectedStrategies) || [])
              .sort((a, b) => (a.priorityOrder ?? 0) - (b.priorityOrder ?? 0))
            b3Selected = sorted.map((s) => s.candidateStrategyId).filter(Boolean)
            // Build map: candidateStrategyId → selectedStrategyId (UUID bảng selected_strategies)
            sorted.forEach((s) => {
              if (s.candidateStrategyId && s.selectedStrategyId) {
                b3SelectedIds[s.candidateStrategyId] = s.selectedStrategyId
              }
            })
          } catch {
            // B3 not started yet — ignore
          }

          set({ analysisItemsRaw, swotItemsRaw, sevenS, fiveForces, pestel, swotS, swotW, swotO, swotT, strategies, b3Selected, b3SelectedIds, loading: false })
        } catch (e) {
          console.error('[swotStore] fetch failed:', e)
          set({ loading: false })
        }
      },

  // ── Source model CRUD (7S / 5 Forces / PESTEL) ───────────────────────────

  /**
   * Re-sync analysisItemsRaw + sevenS/fiveForces/pestel with backend response.
   * After an upsert, backend assigns real UUIDs. We match by content+modelType+factorCode
   * and update local IDs so swotItem operations receive valid backend UUIDs.
   */
  _syncAnalysisItemsFromResponse: (responseItems) => {
    if (!responseItems || responseItems.length === 0) return
    const { sevenS, fiveForces, pestel } = get()
    const newRaw = responseItems.map((item) => ({
      id: item.id,
      modelType: item.modelType,
      factorCode: item.factorCode,
      content: item.content,
      displayOrder: item.displayOrder ?? 0,
    }))

    // Rebuild nested display model with backend IDs
    const newSevenS = {}; const newFiveForces = {}; const newPestel = {}
    responseItems.forEach((item) => {
      const key = MODEL_TYPE_TO_KEY[item.modelType]
      if (!key) return
      const target = { sevenS: newSevenS, fiveForces: newFiveForces, pestel: newPestel }[key]
      if (!target[item.factorCode]) target[item.factorCode] = []
      target[item.factorCode].push({ id: item.id, value: item.content })
    })

    // Preserve factors that existed locally but weren't in response (edge case)
    // by keeping original entries not in response
    const mergeWithFallback = (original, updated) => {
      const result = { ...original }
      Object.keys(updated).forEach((factor) => {
        result[factor] = updated[factor]
      })
      return result
    }

    set({
      analysisItemsRaw: newRaw,
      sevenS:     mergeWithFallback(sevenS,     newSevenS),
      fiveForces: mergeWithFallback(fiveForces, newFiveForces),
      pestel:     mergeWithFallback(pestel,     newPestel),
    })
  },

  _safeSyncFromBackend: async () => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return null

    // Load active candidates directly from backend to determine TRUE source analysis IDs
    const rawCandidates = await strategyBuildingService.listCandidateStrategies(strategyId).catch(() => [])
    const activeCandidates = (rawCandidates || []).filter((cs) => cs.status !== 'DELETED')
    
    const realAnalysisIds = new Set()
    activeCandidates.forEach((cs) => {
      ;(cs.swotItems || []).forEach((si) => realAnalysisIds.add(si.sourceAnalysisItemId))
    })

    const safePayload = get().analysisItemsRaw.map(a => ({
      id: realAnalysisIds.has(a.id) ? a.id : undefined, // ONLY send IDs verified by the backend
      modelType: a.modelType,
      factorCode: a.factorCode,
      content: a.content,
      displayOrder: a.displayOrder || 0
    }))

    if (safePayload.length === 0) return null

    const syncResp = await strategyBuildingService.upsertAnalysisItems(strategyId, safePayload)
    if (syncResp?.analysisItems) {
      get()._syncAnalysisItemsFromResponse(syncResp.analysisItems)
    }
    return syncResp
  },

  addSourceItem: async (modelKey, factor, value) => {
    const tempId = uid()
    // Optimistic update with temp ID
    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: [...(state[modelKey][factor] || []), { id: tempId, value: value.trim() }],
      },
      analysisItemsRaw: [
        ...state.analysisItemsRaw,
        {
          id: tempId,
          modelType: MODEL_KEY_TO_TYPE[modelKey],
          factorCode: factor,
          content: value.trim(),
          displayOrder: (state[modelKey][factor] || []).length,
        },
      ],
    }))

    // Sync to backend — send without id for new items (id=undefined → backend creates)
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      try {
        const response = await get()._safeSyncFromBackend()
      } catch (e) {
        console.error('upsertAnalysisItems failed:', e)
      }
    }
  },

  updateSourceItem: async (modelKey, factor, id, value) => {
    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: (state[modelKey][factor] || []).map((item) =>
          item.id === id ? { ...item, value: value.trim() } : item
        ),
      },
      analysisItemsRaw: state.analysisItemsRaw.map((item) =>
        item.id === id ? { ...item, content: value.trim() } : item
      ),
    }))
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      try {
        const response = await get()._safeSyncFromBackend()
      } catch (e) {
        console.error('upsertAnalysisItems failed:', e)
      }
    }
  },

  removeSourceItem: (modelKey, factor, id) => {
    const { swotItemsRaw } = get()
    // Delete associated swot item if exists
    const relatedSwotItem = swotItemsRaw.find((si) => si.sourceAnalysisItemId === id)
    if (relatedSwotItem) {
      const strategyId = useBscContextStore.getState().strategyId
      if (strategyId) {
        strategyBuildingService.deleteSwotItem(relatedSwotItem.id).catch(console.error)
      }
    }

    set((state) => ({
      [modelKey]: {
        ...state[modelKey],
        [factor]: (state[modelKey][factor] || []).filter((item) => item.id !== id),
      },
      analysisItemsRaw: state.analysisItemsRaw.filter((item) => item.id !== id),
      swotItemsRaw: state.swotItemsRaw.filter((si) => si.sourceAnalysisItemId !== id),
      swotS: state.swotS.filter((sid) => sid !== id),
      swotW: state.swotW.filter((sid) => sid !== id),
      swotO: state.swotO.filter((sid) => sid !== id),
      swotT: state.swotT.filter((sid) => sid !== id),
    }))

    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      try {
        get()._safeSyncFromBackend()
      } catch (e) {
        console.error('upsertAnalysisItems failed during remove:', e)
      }
    }
  },

  // ── SWOT selection ────────────────────────────────────────────────────────
  toggleSwotItem: async (quadrant, analysisItemId) => {
    const key = `swot${quadrant}`
    const opposite = { S: 'W', W: 'S', O: 'T', T: 'O' }[quadrant]
    const oppositeKey = `swot${opposite}`
    const { swotItemsRaw } = get()
    const strategyId = useBscContextStore.getState().strategyId
    const isSelected = get()[key].includes(analysisItemId)

    if (isSelected) {
      // Deselect: delete swot item from backend
      const swotItem = swotItemsRaw.find(
        (si) => si.sourceAnalysisItemId === analysisItemId && si.swotType === quadrant
      )
      if (swotItem && strategyId) {
        try {
          await strategyBuildingService.deleteSwotItem(swotItem.id)
        } catch (e) {
          console.error('deleteSwotItem failed:', e)
        }
      }
      set((state) => ({
        [key]: state[key].filter((id) => id !== analysisItemId),
        swotItemsRaw: state.swotItemsRaw.filter(
          (si) => !(si.sourceAnalysisItemId === analysisItemId && si.swotType === quadrant)
        ),
      }))
    } else {
      // Select: create swot item in backend
      const isInOpposite = get()[oppositeKey].includes(analysisItemId)

      let newSwotItem = { id: uid(), swotType: quadrant, sourceAnalysisItemId: analysisItemId }
      if (strategyId) {
        try {
          // createSwotItem returns StrategyBuildingResponse — find the matching swot item in swotItems[]
          const buildingResp = await strategyBuildingService.createSwotItem(strategyId, {
            swotType: quadrant,
            sourceAnalysisItemId: analysisItemId,
          })
          const created = (buildingResp?.swotItems || []).find(
            (si) => String(si.swotType) === quadrant && si.sourceAnalysisItemId === analysisItemId
          )
          if (created?.id) {
            newSwotItem = { id: created.id, swotType: quadrant, sourceAnalysisItemId: analysisItemId }
          }
        } catch (e) {
          console.error('createSwotItem failed, attempting to sync from backend:', e)
          // Fallback: If it failed (e.g. duplicated source), force a safe sync to fetch the real ID
          try {
            const syncResp = await get()._safeSyncFromBackend()
            const created = (syncResp?.swotItems || []).find(
              (si) => String(si.swotType) === quadrant && si.sourceAnalysisItemId === analysisItemId
            )
            if (created?.id) {
              newSwotItem = { id: created.id, swotType: quadrant, sourceAnalysisItemId: analysisItemId }
            }
          } catch (syncErr) {
            console.error('sync fallback failed:', syncErr)
          }
        }
      }

      // If was in opposite quadrant, remove it
      if (isInOpposite) {
        const oppositeSwotItem = get().swotItemsRaw.find(
          (si) => si.sourceAnalysisItemId === analysisItemId && si.swotType === opposite
        )
        if (oppositeSwotItem && strategyId) {
          strategyBuildingService.deleteSwotItem(oppositeSwotItem.id).catch(console.error)
        }
      }

      set((state) => ({
        [key]: [...state[key], analysisItemId],
        [oppositeKey]: isInOpposite
          ? state[oppositeKey].filter((id) => id !== analysisItemId)
          : state[oppositeKey],
        swotItemsRaw: [
          ...state.swotItemsRaw.filter(
            (si) => !(si.sourceAnalysisItemId === analysisItemId && si.swotType === opposite)
          ),
          newSwotItem,
        ],
      }))
    }
  },

  // ── Candidate strategies ──────────────────────────────────────────────────
  addStrategy: async (data) => {
    // data = { type, name, description, sItems: [analysisItemId], wItems, oItem, tItem }
    const strategyId = useBscContextStore.getState().strategyId
    const { swotItemsRaw } = get()

    const resolveSwotIds = (analysisIds, swotType) =>
      (analysisIds || [])
        .map((aid) => swotItemsRaw.find((si) => si.sourceAnalysisItemId === aid && si.swotType === swotType)?.id)
        .filter(Boolean)

    const swotItemIds = [
      ...resolveSwotIds(data.sItems, 'S'),
      ...resolveSwotIds(data.wItems, 'W'),
      ...resolveSwotIds(data.oItem ? [data.oItem] : [], 'O'),
      ...resolveSwotIds(data.tItem ? [data.tItem] : [], 'T'),
    ]

    if (strategyId) {
      try {
        const response = await strategyBuildingService.createCandidateStrategy(strategyId, {
          strategyGroup: data.type,
          name: data.name,
          description: data.description || '',
          swotItemIds,
          displayOrder: get().strategies.length,
        })
        const newStrategy = {
          id: response.id,
          type: response.strategyGroup,
          name: response.name,
          description: response.description || '',
          sItems: data.sItems || [],
          wItems: data.wItems || [],
          oItem: data.oItem ?? null,
          tItem: data.tItem ?? null,
        }
        set((state) => ({ strategies: [...state.strategies, newStrategy] }))
      } catch (e) {
        console.error('createCandidateStrategy failed:', e)
        const msg = e.response?.data?.message || e.message || 'Lỗi khi tạo chiến lược'
        import('../components/ui/toast.jsx').then(m => m.toast.error(msg))
      }
    } else {
      // No backend — local fallback
      const newStrategy = { ...data, id: uid() }
      set((state) => ({ strategies: [...state.strategies, newStrategy] }))
    }
  },

  updateStrategy: async (id, data) => {
    const strategyId = useBscContextStore.getState().strategyId
    const { swotItemsRaw } = get()

    const resolveSwotIds = (analysisIds, swotType) =>
      (analysisIds || [])
        .map((aid) => swotItemsRaw.find((si) => si.sourceAnalysisItemId === aid && si.swotType === swotType)?.id)
        .filter(Boolean)

    const swotItemIds = [
      ...resolveSwotIds(data.sItems, 'S'),
      ...resolveSwotIds(data.wItems, 'W'),
      ...resolveSwotIds(data.oItem ? [data.oItem] : [], 'O'),
      ...resolveSwotIds(data.tItem ? [data.tItem] : [], 'T'),
    ]

    // Update local immediately
    set((state) => ({
      strategies: state.strategies.map((s) => (s.id === id ? { ...s, ...data } : s)),
    }))

    if (strategyId) {
      try {
        await strategyBuildingService.updateCandidateStrategy(id, {
          strategyGroup: data.type,
          name: data.name,
          description: data.description || '',
          swotItemIds,
        })
      } catch (e) {
        console.error('updateCandidateStrategy failed:', e)
        const msg = e.response?.data?.message || e.message || 'Lỗi khi cập nhật chiến lược'
        import('../components/ui/toast.jsx').then(m => m.toast.error(msg))
      }
    }
  },

  deleteStrategy: async (id) => {
    set((state) => ({ strategies: state.strategies.filter((s) => s.id !== id) }))
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      strategyBuildingService.deleteCandidateStrategy(id).catch(console.error)
    }
  },

  // ── Helpers for pages ─────────────────────────────────────────────────────
  getAllSevenSItems: () => {
    const { sevenS } = get()
    return Object.entries(sevenS).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor }))
    )
  },

  getAllExternalItems: () => {
    const { fiveForces, pestel } = get()
    const ff = Object.entries(fiveForces).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor, source: 'fiveForces' }))
    )
    const pe = Object.entries(pestel).flatMap(([factor, items]) =>
      (items || []).map((item) => ({ ...item, factor, source: 'pestel' }))
    )
    return [...ff, ...pe]
  },

  getUsedSwotItemIds: () => {
    const { strategies } = get()
    const used = new Set()
    strategies.forEach((s) => {
      ;(s.sItems || []).forEach((id) => used.add(id))
      ;(s.wItems || []).forEach((id) => used.add(id))
      if (s.oItem) used.add(s.oItem)
      if (s.tItem) used.add(s.tItem)
    })
    return used
  },

  // ── B3 selection ──────────────────────────────────────────────────────────
  toggleB3Strategy: async (id) => {
    const { b3Selected } = get()
    const already = b3Selected.includes(id)

    let newSelected
    if (already) {
      newSelected = b3Selected.filter((x) => x !== id)
      set((state) => {
        const newNotes = { ...state.b3Notes }
        delete newNotes[id]
        return { b3Selected: newSelected, b3Notes: newNotes }
      })
    } else {
      if (b3Selected.length >= 2) return
      newSelected = [...b3Selected, id]
      set((state) => ({
        b3Selected: newSelected,
        b3Notes: { ...state.b3Notes, [id]: '' },
      }))
    }

    // Sync to backend
    const strategyId = useBscContextStore.getState().strategyId
    if (strategyId) {
      strategySelectionService.select(strategyId, newSelected).catch(console.error)
    }
  },

  setB3Note: (id, note) =>
    set((state) => ({ b3Notes: { ...state.b3Notes, [id]: note } })),

  validateB3: () => {
    const { b3Selected, strategies } = get()
    const errors = []
    if (b3Selected.length === 0) errors.push('Cần chọn ít nhất 1 chiến lược')
    if (b3Selected.length > 2) errors.push('Không được chọn quá 2 chiến lược')
    b3Selected.forEach((id) => {
      if (!strategies.find((s) => s.id === id))
        errors.push(`Chiến lược ${id} không còn tồn tại — vui lòng chọn lại`)
    })
    return errors
  },

  validate: () => {
    const state = get()
    const errors = []
    const has7S = Object.values(state.sevenS).some((arr) => arr?.length > 0)
    const has5F = Object.values(state.fiveForces).some((arr) => arr?.length > 0)
    const hasPe = Object.values(state.pestel).some((arr) => arr?.length > 0)
    if (!has7S) errors.push('Mô hình 7S: cần nhập ít nhất 1 yếu tố')
    if (!has5F) errors.push('Mô hình 5 Áp lực: cần nhập ít nhất 1 yếu tố')
    if (!hasPe) errors.push('Mô hình PESTEL: cần nhập ít nhất 1 yếu tố')
    if (state.swotS.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm mạnh (S)')
    if (state.swotW.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Điểm yếu (W)')
    if (state.swotO.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Cơ hội (O)')
    if (state.swotT.length === 0) errors.push('SWOT: cần chọn ít nhất 1 Thách thức (T)')
    if (state.strategies.length === 0) errors.push('Chiến lược: cần tạo ít nhất 1 chiến lược')
    if (state.strategies.length > 12) errors.push('Chiến lược: tổng không được vượt quá 12')
    return errors
  },

  // ── Complete B2 ───────────────────────────────────────────────────────────
  completeB2: async () => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validate()
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      // Save all analysis items first
      const allItems = buildAnalysisItems(get().sevenS, get().fiveForces, get().pestel)
      if (allItems.length > 0) {
        await strategyBuildingService.upsertAnalysisItems(strategyId, allItems)
      }
      await strategyBuildingService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B2')
      set({ saving: false })
      return []
    } catch (e) {
      set({ saving: false, error: e.message })
      return [e.message]
    }
  },

  // ── Complete B3 ───────────────────────────────────────────────────────────
  completeB3: async () => {
    const strategyId = useBscContextStore.getState().strategyId
    if (!strategyId) return ['Chưa khởi tạo chiến lược.']

    const errs = get().validateB3()
    if (errs.length > 0) return errs

    set({ saving: true, error: null })
    try {
      await strategySelectionService.select(strategyId, get().b3Selected)
      await strategySelectionService.complete(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B3')
      set({ saving: false })
      return []
    } catch (e) {
      return [e.message]
    }
  },
}), {
  name: 'bsc-swot-storage',
  partialize: (state) => ({
    currentStrategyId: state.currentStrategyId,
    analysisItemsRaw: state.analysisItemsRaw,
    swotItemsRaw: state.swotItemsRaw,
    sevenS: state.sevenS,
    fiveForces: state.fiveForces,
    pestel: state.pestel,
    swotS: state.swotS,
    swotW: state.swotW,
    swotO: state.swotO,
    swotT: state.swotT,
    strategies: state.strategies,
    b3Selected: state.b3Selected,
    b3Notes: state.b3Notes,
    b3SelectedIds: state.b3SelectedIds
  })
}))
