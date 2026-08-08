import { Navigate, useLocation } from 'react-router-dom'
import { roleHomePath, type UserRole } from '@/auth/mockUsers'
import { useAuth } from '@/auth/AuthContext'

type ProtectedRouteProps = {
  role: UserRole
  children: React.ReactNode
}

const roleAllowedPrefix: Record<UserRole, string> = {
  employee: '/employee/employee',
  pm: '/pm',
  leadership: '/leadership/executive',
  admin: '/admin',
  'saas-admin': '/saas-admin',
}

export function ProtectedRoute({ role, children }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== role) {
    return <Navigate to={roleHomePath[user.role]} replace />
  }

  const allowedPrefix = roleAllowedPrefix[user.role]
  if (!location.pathname.startsWith(allowedPrefix)) {
    return <Navigate to={roleHomePath[user.role]} replace />
  }

  return <>{children}</>
}
