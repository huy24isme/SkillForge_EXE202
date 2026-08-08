import { create } from 'zustand'

// Task statuses per doc spec
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']

export const STATUS_META = {
  TODO:        { label: 'Chờ làm',      color: '#64748b', bg: '#f1f5f9' },
  IN_PROGRESS: { label: 'Đang làm',     color: '#2563eb', bg: '#dbeafe' },
  REVIEW:      { label: 'Đang xem xét', color: '#7c3aed', bg: '#ede9fe' },
  DONE:        { label: 'Hoàn thành',   color: '#16a34a', bg: '#dcfce7' },
  BLOCKED:     { label: 'Bị chặn',      color: '#dc2626', bg: '#fee2e2' },
  CANCELLED:   { label: 'Hủy bỏ',       color: '#9ca3af', bg: '#f3f4f6' },
}

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

export const PRIORITY_META = {
  LOW:      { label: 'Thấp',      color: '#64748b' },
  MEDIUM:   { label: 'Trung bình', color: '#d97706' },
  HIGH:     { label: 'Cao',       color: '#ea580c' },
  CRITICAL: { label: 'Khẩn cấp', color: '#dc2626' },
}

// Shape:
//   actionPlans: [{ id, kpiId (= departmentKpiId), name, description, ownerId, ownerName, startDate, endDate, priority, status }]
//   tasks: [{ id, actionPlanId, name, description, assigneeId, assigneeName, startDate, dueDate,
//             status, priority, progressPercent, blockReason }]
//   kpiReports: [{ id, departmentKpiId, reportingPeriod, actualValue, note, reviewStatus, completionRate, statusColor }]

export const useActionPlanStore = create((set, get) => ({
  actionPlans: [],
  tasks: [],
  kpiReports: [],

  loading: false,
  saving: false,
  error: null,

  // ── Load from backend ────────────────────────────────────────

  fetchActionPlans: async (strategyId) => {
    if (!strategyId) return
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    set({ loading: true, error: null })
    try {
      const list = await actionPlanService.listActionPlans(strategyId)
      const actionPlans = (list || []).map((ap) => ({
        id: ap.id,
        kpiId: ap.departmentKpiId,
        name: ap.name,
        description: ap.description ?? '',
        ownerId: ap.ownerId ?? '',
        ownerName: ap.ownerName ?? '',
        startDate: ap.startDate ?? '',
        endDate: ap.endDate ?? '',
        priority: ap.priority ?? 'MEDIUM',
        status: ap.status ?? 'ACTIVE',
      }))
      set({ actionPlans, loading: false })
    } catch (e) {
      set({ loading: false, error: e.message })
    }
  },

  fetchTasks: async (strategyId) => {
    if (!strategyId) return
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    try {
      const kanban = await actionPlanService.getKanban(strategyId)
      // kanban: { columns: [{ status, tasks: [{ id, actionPlanId, name, ... }] }] }
      const tasks = []
      ;(kanban?.columns || []).forEach((col) => {
        ;(col.tasks || []).forEach((t) => {
          tasks.push({
            id: t.id,
            actionPlanId: t.actionPlanId,
            name: t.name,
            description: t.description ?? '',
            assigneeId: t.assigneeId ?? '',
            assigneeName: t.assigneeName ?? '',
            startDate: t.startDate ?? '',
            dueDate: t.dueDate ?? '',
            status: t.status ?? 'TODO',
            priority: t.priority ?? 'MEDIUM',
            progressPercent: t.progressPercent ?? 0,
            blockReason: t.blockReason ?? '',
          })
        })
      })
      set({ tasks })
    } catch (e) {
      set({ error: e.message })
    }
  },

  // ── Action Plans ─────────────────────────────────────────────

  addActionPlan: async (strategyId, data) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    set({ saving: true, error: null })
    try {
      const ap = await actionPlanService.createActionPlan({
        bscStrategyId: strategyId,
        departmentKpiId: data.kpiId,
        name: data.name?.trim() ?? '',
        description: data.description?.trim() || undefined,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        ownerId: data.ownerId || undefined,
        priority: data.priority ?? 'MEDIUM',
        status: 'ACTIVE',
      })
      set((state) => ({
        actionPlans: [...state.actionPlans, {
          id: ap.id,
          kpiId: ap.departmentKpiId,
          name: ap.name,
          description: ap.description ?? '',
          ownerId: ap.ownerId ?? '',
          ownerName: data.ownerName ?? '',
          startDate: ap.startDate ?? '',
          endDate: ap.endDate ?? '',
          priority: ap.priority ?? 'MEDIUM',
          status: ap.status ?? 'ACTIVE',
        }],
        saving: false,
      }))
      return ap
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  updateActionPlan: async (id, changes) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    set({ saving: true, error: null })
    try {
      const ap = await actionPlanService.updateActionPlan(id, {
        name: changes.name?.trim(),
        description: changes.description?.trim() || undefined,
        startDate: changes.startDate || undefined,
        endDate: changes.endDate || undefined,
        ownerId: changes.ownerId || undefined,
        priority: changes.priority,
        status: changes.status,
      })
      set((state) => ({
        actionPlans: state.actionPlans.map((a) =>
          a.id === id ? { ...a, ...changes, status: ap?.status ?? changes.status } : a
        ),
        saving: false,
      }))
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  // Soft-delete via status change (no DELETE endpoint for action plans)
  deleteActionPlan: async (id) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    try {
      await actionPlanService.updateActionPlan(id, { status: 'CANCELLED' })
    } catch {/* ignore */ }
    set((state) => ({
      actionPlans: state.actionPlans.filter((ap) => ap.id !== id),
      tasks: state.tasks.filter((t) => t.actionPlanId !== id),
    }))
  },

  // ── Tasks ────────────────────────────────────────────────────

  addTask: async (data) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    set({ saving: true, error: null })
    try {
      const task = await actionPlanService.createTask({
        actionPlanId: data.actionPlanId,
        assigneeId: data.assigneeId || undefined,
        name: data.name?.trim() ?? '',
        description: data.description?.trim() || undefined,
        startDate: data.startDate || undefined,
        dueDate: data.dueDate || undefined,
        priority: data.priority ?? 'MEDIUM',
      })
      set((state) => ({
        tasks: [...state.tasks, {
          id: task.id,
          actionPlanId: task.actionPlanId,
          name: task.name,
          description: task.description ?? '',
          assigneeId: task.assigneeId ?? '',
          assigneeName: data.assigneeName ?? '',
          startDate: task.startDate ?? '',
          dueDate: task.dueDate ?? '',
          status: task.status ?? 'TODO',
          priority: task.priority ?? 'MEDIUM',
          progressPercent: task.progressPercent ?? 0,
          blockReason: task.blockReason ?? '',
        }],
        saving: false,
      }))
      return task
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  updateTask: (id, changes) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, ...changes } : t),
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id),
  })),

  setTaskStatus: async (id, status, extra = {}) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id !== id) return t
        const update = { ...t, status, ...extra }
        if (status === 'DONE') update.progressPercent = 100
        return update
      }),
    }))
    try {
      await actionPlanService.updateTaskStatus(id, {
        newStatus: status,
        progressPercent: status === 'DONE' ? 100 : (extra.progressPercent ?? undefined),
        comment: extra.comment ?? undefined,
        blockReason: status === 'BLOCKED' ? (extra.blockReason ?? '') : null,
      })
    } catch (e) {
      set({ error: e.message })
    }
  },

  setTaskProgress: (id, progressPercent) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, progressPercent } : t),
  })),

  // ── KPI Reports ──────────────────────────────────────────────

  addKpiReport: async (data) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    set({ saving: true, error: null })
    try {
      const report = await actionPlanService.createKpiReport({
        departmentKpiId: data.kpiId,
        reportingPeriod: data.reportedAt ?? new Date().toISOString().slice(0, 7),
        actualValue: Number(data.actualValue),
        note: data.note?.trim() || undefined,
        reviewStatus: 'SUBMITTED',
      })
      set((state) => ({
        kpiReports: [...state.kpiReports, {
          id: report.id,
          kpiId: report.departmentKpiId,
          reportingPeriod: report.reportingPeriod,
          actualValue: report.actualValue,
          note: report.note ?? '',
          reviewStatus: report.reviewStatus ?? 'SUBMITTED',
          completionRate: report.completionRate,
          statusColor: report.statusColor,
        }],
        saving: false,
      }))
      return report
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  fetchKpiReports: async (departmentKpiId) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    try {
      const list = await actionPlanService.listKpiReports(departmentKpiId)
      const fetched = (list || []).map((r) => ({
        id: r.id,
        kpiId: r.departmentKpiId,
        reportingPeriod: r.reportingPeriod,
        actualValue: r.actualValue,
        note: r.note ?? '',
        reviewStatus: r.reviewStatus ?? 'SUBMITTED',
        completionRate: r.completionRate,
        statusColor: r.statusColor,
      }))
      set((state) => {
        // Merge: replace existing reports for this KPI
        const others = state.kpiReports.filter((r) => r.kpiId !== departmentKpiId)
        return { kpiReports: [...others, ...fetched] }
      })
    } catch (e) {
      set({ error: e.message })
    }
  },

  deleteKpiReport: (id) => set((state) => ({
    kpiReports: state.kpiReports.filter((r) => r.id !== id),
  })),

  reviewKpiReport: async (reportId, reviewStatus, note) => {
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    try {
      await actionPlanService.reviewKpiReport(reportId, { reviewStatus, note })
      set((state) => ({
        kpiReports: state.kpiReports.map((r) =>
          r.id === reportId ? { ...r, reviewStatus } : r
        ),
      }))
    } catch (e) {
      set({ error: e.message })
      throw e
    }
  },

  // Complete B8
  completeB8: async (strategyId) => {
    if (!strategyId) throw new Error('Chưa có chiến lược')
    const { default: actionPlanService } = await import('../services/actionPlanService.js')
    const { useBSCWorkflowStore } = await import('./bscWorkflowStore.js')
    set({ saving: true, error: null })
    try {
      await actionPlanService.completeB8(strategyId)
      useBSCWorkflowStore.getState().markStepComplete('B8')
      set({ saving: false })
    } catch (e) {
      set({ saving: false, error: e.message })
      throw e
    }
  },

  // ── Derived helpers ──────────────────────────────────────────
  getActionPlansForKpi: (kpiId) => get().actionPlans.filter((ap) => ap.kpiId === kpiId),
  getTasksForActionPlan: (apId) => get().tasks.filter((t) => t.actionPlanId === apId),
  getReportsForKpi: (kpiId) => get().kpiReports.filter((r) => r.kpiId === kpiId),
}))
