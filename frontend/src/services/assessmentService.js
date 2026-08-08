import api from './api';

const assessmentService = {
  get: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/assessment`),

  upsertFinancials: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/assessment/financials`, { items }),
  // items: [{ label, currentValue, targetValue, unit, ... }]

  upsertMarketShares: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/assessment/market-shares`, { items }),

  upsertTextItems: (strategyId, items) =>
    api.put(`/bsc-strategies/${strategyId}/assessment/text-items`, { items }),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/assessment/complete`),
};

export default assessmentService;
