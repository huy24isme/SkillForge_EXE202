import api from './api';

const profileService = {
  /**
   * Change password for the currently authenticated user.
   * PUT /auth/change-password
   */
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  /**
   * Update display profile (fullName, title) for the currently authenticated user.
   * PUT /auth/profile
   */
  updateProfile: (fullName, title) =>
    api.put('/auth/profile', { fullName, title }),
};

export default profileService;
