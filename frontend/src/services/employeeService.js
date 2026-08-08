import api from './api';

const employeeService = {
  create: (companyId, data) =>
    api.post(`/companies/${companyId}/employees`, data),
  // data: { departmentId, fullName, email, phone?, positionTitle? }

  listByCompany: (companyId, departmentId = null) => {
    const params = departmentId ? { departmentId } : {};
    return api.get(`/companies/${companyId}/employees`, { params });
  },

  update: (employeeId, data) =>
    api.put(`/employees/${employeeId}`, data),
  // data: { departmentId?, fullName?, phone?, positionTitle? }

  delete: (employeeId) =>
    api.delete(`/employees/${employeeId}`),

  createAccount: (employeeId, data) =>
    api.post(`/employees/${employeeId}/account`, data),
  // data: { email, password, role }
};

export default employeeService;
