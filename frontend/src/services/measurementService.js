import api from './api';

const measurementService = {
  // B7.1 — Upsert KPI measurement (one per KPI)
  upsertMeasurement: (departmentKpiId, data) =>
    api.put(`/department-kpis/${departmentKpiId}/measurement`, data),
  // data: { unit, baselineValue?, targetValue, direction, reportingFrequency,
  //         formulaDescription?, greenThreshold?, yellowThreshold?, redThreshold?, reportOwnerId? }

  // B7.2 — Get all measurements for strategy
  getMeasurements: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/measurements`),

  // B7.3 — Complete B7
  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/measurements/complete`),
};

export default measurementService;
