import api from './api';

const companyService = {
  create: (data) =>
    api.post('/companies', data),
  // data: { name, taxCode?, industry?, size? }

  getById: (companyId) =>
    api.get(`/companies/${companyId}`),

  update: (companyId, data) =>
    api.put(`/companies/${companyId}`, data),
  // data: { name?, taxCode?, industry?, size? }
};

export default companyService;
