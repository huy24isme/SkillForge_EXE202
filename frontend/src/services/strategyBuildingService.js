import api from './api';

const strategyBuildingService = {
  // ── Fetch (load B2 state by composing existing endpoints) ──────────────────
  // NOTE: GET /bsc-strategies/{id}/strategy-building does NOT exist on backend.
  // We load data using the individual endpoints that do exist.

  // GET /bsc-strategies/{id}/analysis-items  — but this doesn't exist as GET either.
  // We reconstruct analysis items from candidate-strategies swotItems field.

  // GET /bsc-strategies/{id}/candidate-strategies — returns CandidateStrategyResponse[]
  // Each CandidateStrategyResponse has swotItems: CandidateStrategySwotItemResponse[]
  // Each CandidateStrategySwotItemResponse has:
  //   swotItemId, swotType, sourceAnalysisItemId, sourceModelType, sourceFactorCode, contentSnapshot
  listCandidateStrategies: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/candidate-strategies`),

  // Analysis items (upsert — PUT) — the only write endpoint for analysis data
  upsertAnalysisItems: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/analysis-items`, { items }),

  // SWOT
  createSwotItem: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/swot-items`, data),
  // data: { swotType, sourceAnalysisItemId } → returns StrategyBuildingResponse

  deleteSwotItem: (swotItemId) =>
    api.delete(`/swot-items/${swotItemId}`),

  // Candidate Strategies
  createCandidateStrategy: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/candidate-strategies`, data),
  // data: { strategyGroup, name, description?, swotItemIds, displayOrder? }

  updateCandidateStrategy: (candidateStrategyId, data) =>
    api.put(`/candidate-strategies/${candidateStrategyId}`, data),

  deleteCandidateStrategy: (candidateStrategyId) =>
    api.delete(`/candidate-strategies/${candidateStrategyId}`),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/strategy-building/complete`),
};

export default strategyBuildingService;
