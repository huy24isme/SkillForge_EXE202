import { createContext, useContext, useMemo, useState } from 'react'
import { mockUsers, type MockUser, type UserRole } from '@/auth/mockUsers'

type AuthUser = {
  email: string
  username: string
  displayName: string
  role: UserRole
}

type LoginPayload = {
  email: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => { success: boolean; message?: string }
  logout: () => void
}

const AUTH_STORAGE_KEY = 'skillforge-auth-user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function toAuthUser(user: MockUser): AuthUser {
  return {
    email: user.email,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  }
}

function readInitialUser(): AuthUser | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.role) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readInitialUser())

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: !!user,
      login: ({ email, password }) => {
        const normalizedInput = email.trim().toLowerCase()
        const normalizedPassword = password.trim()

        if (!normalizedInput || !normalizedPassword) {
          return {
            success: false,
            message: 'Vui lòng nhập email và mật khẩu',
          }
        }

        const matched = mockUsers.find(
          (mockUser) =>
            (mockUser.email.toLowerCase() === normalizedInput ||
             mockUser.username.toLowerCase() === normalizedInput) &&
            mockUser.password === normalizedPassword,
        )

        if (!matched) {
          return {
            success: false,
            message: 'Sai email hoặc mật khẩu',
          }
        }

        const authUser = toAuthUser(matched)
        setUser(authUser)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser))

        return {
          success: true,
        }
      },
      logout: () => {
        setUser(null)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      },
    }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
