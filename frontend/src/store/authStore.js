import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import authService from '../services/authService.js'
import profileService from '../services/profileService.js'

// ── Role display mapping ──────────────────────────────────────────────────────
export const ROLES = {
  CEO:           { id: 'CEO',           label: 'Giám đốc',         color: '#7c3aed' },
  DEPARTMENT_HEAD: { id: 'DEPARTMENT_HEAD', label: 'Trưởng phòng', color: '#2563eb' },
  EMPLOYEE:      { id: 'EMPLOYEE',      label: 'Nhân viên',        color: '#16a34a' },
  COMPANY_ADMIN: { id: 'COMPANY_ADMIN', label: 'Quản trị viên',    color: '#dc2626' },
  SYSTEM_ADMIN:  { id: 'SYSTEM_ADMIN',  label: 'System Admin',     color: '#64748b' },
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,    // AuthenticatedUserResponse từ backend
      token: null,   // JWT access token
      loading: false,
      error: null,

      /**
       * Login with email + password against real backend.
       * Returns true on success, false on failure (sets error message).
       */
      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const response = await authService.login(email, password)
          // response = { accessToken, tokenType, expiresIn, user }
          set({
            user: response.user,
            token: response.accessToken,
            loading: false,
            error: null,
          })
          return true
        } catch (e) {
          set({ loading: false, error: e.message, user: null, token: null })
          return false
        }
      },

      logout: () => set({ user: null, token: null, error: null }),

      clearError: () => set({ error: null }),

      /**
       * Update local user profile (fullName, title) — also persists to backend.
       * Returns { ok, error }.
       */
      updateProfile: async (fullName, title) => {
        try {
          await profileService.updateProfile(fullName, title)
          set((state) => ({
            user: state.user
              ? { ...state.user, fullName: fullName || state.user.fullName, title: title ?? state.user.title }
              : state.user,
          }))
          return { ok: true }
        } catch (e) {
          return { ok: false, error: e.message }
        }
      },

      /**
       * Change password — calls backend API.
       * Returns { ok, error }.
       */
      changePassword: async (currentPassword, newPassword) => {
        try {
          await profileService.changePassword(currentPassword, newPassword)
          return { ok: true }
        } catch (e) {
          return { ok: false, error: e.message }
        }
      },
    }),
    {
      name: 'skillforge-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
