import api from './api';

const fishboneService = {
  // Department Participation
  joinFinalObjective: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/department-participations`, data),
  // data: { finalStrategicObjectiveId, departmentId, departmentHeadId? }

  removeParticipation: (participationId) =>
    api.delete(`/department-participations/${participationId}`),

  // Department KPIs
  createDepartmentKpi: (data) =>
    api.post('/department-kpis', data),
  // data: { bscStrategyId, finalStrategicObjectiveId, departmentId, departmentParticipationId, name, description?, displayOrder? }

  updateDepartmentKpi: (departmentKpiId, data) =>
    api.put(`/department-kpis/${departmentKpiId}`, data),
  // data: { bscStrategyId, finalStrategicObjectiveId, departmentId, departmentParticipationId, name, description?, displayOrder? }

  deleteDepartmentKpi: (departmentKpiId) =>
    api.delete(`/department-kpis/${departmentKpiId}`),

  // Fishbone Views
  getCompanyFishbone: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/fishbone/company`),

  getDepartmentFishbone: (strategyId, departmentId) =>
    api.get(`/bsc-strategies/${strategyId}/fishbone/departments/${departmentId}`),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/fishbone/complete`),
};

export default fishboneService;
