export type UserRole = 'employee' | 'pm' | 'leadership' | 'admin' | 'saas-admin'

export type MockUser = {
  email: string
  username: string
  password: string
  role: UserRole
  displayName: string
}

export const mockUsers: MockUser[] = [
  {
    email: 'ceo@skillforge.vn',
    username: 'leader01',
    password: '123456',
    role: 'leadership',
    displayName: 'Giám đốc (CEO)',
  },
  {
    email: 'head@skillforge.vn',
    username: 'pm01',
    password: '123456',
    role: 'pm',
    displayName: 'Trưởng phòng (PM)',
  },
  {
    email: 'emp@skillforge.vn',
    username: 'employee01',
    password: '123456',
    role: 'employee',
    displayName: 'Nhân viên (Employee)',
  },
  {
    email: 'admin@skillforge.vn',
    username: 'admin01',
    password: '123456',
    role: 'admin',
    displayName: 'Quản trị viên (Company Admin)',
  },
  {
    email: 'saas@skillforge.vn',
    username: 'admin02',
    password: '123456',
    role: 'saas-admin',
    displayName: 'SaaS System Admin',
  },
]

export const roleHomePath: Record<UserRole, string> = {
  employee: '/employee/employee',
  pm: '/pm',
  leadership: '/leadership/executive',
  admin: '/admin',
  'saas-admin': '/saas-admin',
}

