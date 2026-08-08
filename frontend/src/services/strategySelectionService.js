import api from './api';

const strategySelectionService = {
  get: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/selected-strategies`),

  select: (strategyId, candidateStrategyIds) =>
    api.put(`/bsc-strategies/${strategyId}/selected-strategies`, {
      items: (candidateStrategyIds || []).map((id, i) => ({
        candidateStrategyId: id,
        priorityOrder: i + 1,
      })),
    }),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/strategy-result/complete`),
};

export default strategySelectionService;
