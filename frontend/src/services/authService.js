import api from './api';

const authService = {
  /**
   * Login with email + password → returns { accessToken, tokenType, expiresIn, user }
   * user: { userAccountId, employeeId, companyId, departmentId, email, fullName, role }
   */
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  /** Get current authenticated user (requires Bearer token already set in api.js) */
  me: () =>
    api.get('/auth/me'),
};

export default authService;
