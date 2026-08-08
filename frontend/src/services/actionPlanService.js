import api from './api';

const actionPlanService = {
  // ── Action Plans ─────────────────────────────────────────────

  // B8.1 — Create action plan
  createActionPlan: (data) =>
    api.post('/action-plans', data),
  // data: { bscStrategyId, departmentKpiId, name, description?, startDate, endDate, ownerId, priority?, status? }

  // B8.2 — Update action plan
  updateActionPlan: (actionPlanId, data) =>
    api.put(`/action-plans/${actionPlanId}`, data),

  // B8.3 — List action plans for strategy
  listActionPlans: (strategyId, filters = {}) => {
    const params = {}
    if (filters.departmentId) params.departmentId = filters.departmentId
    if (filters.departmentKpiId) params.departmentKpiId = filters.departmentKpiId
    return api.get(`/bsc-strategies/${strategyId}/action-plans`, { params })
  },

  // ── Tasks ─────────────────────────────────────────────────────

  // B8.4 — Create task
  createTask: (data) =>
    api.post('/tasks', data),
  // data: { actionPlanId, assigneeId?, name, description?, startDate, dueDate, priority? }

  // B8.5 — Update task status
  updateTaskStatus: (taskId, data) =>
    api.patch(`/tasks/${taskId}/status`, data),
  // data: { newStatus, progressPercent?, comment?, blockReason? }

  // B8.6 — Get kanban board
  getKanban: (strategyId, filters = {}) => {
    const params = {}
    if (filters.departmentId) params.departmentId = filters.departmentId
    if (filters.assigneeId) params.assigneeId = filters.assigneeId
    return api.get(`/bsc-strategies/${strategyId}/tasks/kanban`, { params })
  },

  // B8.7 — Get gantt data
  getGantt: (strategyId, filters = {}) => {
    const params = {}
    if (filters.departmentId) params.departmentId = filters.departmentId
    return api.get(`/bsc-strategies/${strategyId}/tasks/gantt`, { params })
  },

  // ── KPI Reports ───────────────────────────────────────────────

  // B8.8 — Create KPI report
  createKpiReport: (data) =>
    api.post('/kpi-reports', data),
  // data: { departmentKpiId, reportingPeriod, actualValue, note?, evidenceUrl?, reviewStatus? }

  // B8.9 — List KPI reports for a department KPI
  listKpiReports: (departmentKpiId) =>
    api.get(`/department-kpis/${departmentKpiId}/reports`),

  // B8.9b — List all KPI reports for strategy
  listAllKpiReports: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/kpi-reports`),

  // B8.10 — Review KPI report
  reviewKpiReport: (reportId, data) =>
    api.patch(`/kpi-reports/${reportId}/review`, data),
  // data: { reviewStatus: 'APPROVED' | 'REJECTED', note? }

  // B8.11 — Complete B8
  completeB8: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/action-plan/complete`),
};

export default actionPlanService;
