import api from './api';

const userAccountService = {
  create: (employeeId, data) =>
    api.post(`/employees/${employeeId}/account`, data),
  // data: { email, password, role }
  // role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' (UserRole enum)
};

export default userAccountService;
