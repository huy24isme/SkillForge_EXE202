import api from './api';

const strategyMapService = {
  // Strategy Map
  createStrategyMap: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/strategy-maps`, data),

  // Strategic Objectives
  createObjective: (strategyMapId, data) =>
    api.post(`/strategy-maps/${strategyMapId}/objectives`, data),
  // data: { selectedStrategyId, name, description?, perspectiveCode, displayOrder? }
  // perspectiveCode: 'FINANCIAL' | 'CUSTOMER' | 'INTERNAL_PROCESS' | 'LEARNING_AND_GROWTH'

  updateObjective: (objectiveId, data) =>
    api.put(`/strategic-objectives/${objectiveId}`, data),

  deleteObjective: (objectiveId) =>
    api.delete(`/strategic-objectives/${objectiveId}`),

  // Objective Links (draft)
  createObjectiveLink: (strategyMapId, data) =>
    api.post(`/strategy-maps/${strategyMapId}/objective-links`, data),
  // data: { sourceObjectiveId, targetObjectiveId, note?, displayOrder? }

  deleteObjectiveLink: (objectiveLinkId) =>
    api.delete(`/objective-links/${objectiveLinkId}`),

  // Final Objectives
  buildFinalObjectives: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/final-objectives/build`, data),

  createFinalObjectiveLink: (strategyId, data) =>
    api.post(`/bsc-strategies/${strategyId}/final-objective-links`, data),

  deleteFinalObjectiveLink: (finalObjectiveLinkId) =>
    api.delete(`/final-objective-links/${finalObjectiveLinkId}`),

  getFinalStrategyMap: (strategyId) =>
    api.get(`/bsc-strategies/${strategyId}/final-strategy-map`),

  complete: (strategyId) =>
    api.post(`/bsc-strategies/${strategyId}/strategy-map/complete`),
};

export default strategyMapService;
