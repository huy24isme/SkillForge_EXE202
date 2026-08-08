import api from './api';

const bscStrategyService = {
  create: (companyId, data) =>
    api.post(`/companies/${companyId}/bsc-strategies`, data),
  // data: { name, description?, year }

  getById: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}`),

  // Danh sách bước workflow của chiến lược
  listSteps: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/steps`),
};

export default bscStrategyService;
