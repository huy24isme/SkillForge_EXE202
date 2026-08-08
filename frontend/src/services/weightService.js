import api from './api';

const weightService = {
  // B6.1 — Upsert perspective weights
  // items: [{ perspectiveCode, weightPercent }]
  upsertPerspectiveWeights: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/weights/perspectives`, { items }),

  // B6.2 — Upsert objective weights
  // items: [{ finalStrategicObjectiveId, perspectiveCode, weightPercent }]
  upsertObjectiveWeights: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/weights/objectives`, { items }),

  // B6.3 — Upsert KPI weights
  // items: [{ departmentKpiId, finalStrategicObjectiveId, departmentId, perspectiveCode, weightPercent }]
  upsertKpiWeights: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/weights/kpis`, { items }),

  // B6.4 — Get full weight tree
  getWeightTree: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/weights/tree`),

  // B6.5 — Complete B6
  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/weights/complete`),
};

export default weightService;
