import api from './api';

const departmentService = {
  create: (companyId, data) =>
    api.post(`/companies/${companyId}/departments`, data),
  // data: { name, code, color?, description? }

  listByCompany: (companyId) =>
    api.get(`/companies/${companyId}/departments`),

  update: (departmentId, data) =>
    api.put(`/departments/${departmentId}`, data),
  // data: { name?, code?, color?, description? }

  delete: (departmentId) =>
    api.delete(`/departments/${departmentId}`),
};

export default departmentService;
