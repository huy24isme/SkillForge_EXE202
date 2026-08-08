export const mockDepartments = [
  { id: 'dept-hr',      name: 'Nhân sự (HR)',        color: '#8b5cf6' },
  { id: 'dept-sales',   name: 'Kinh doanh (Sales)',  color: '#10b981' },
  { id: 'dept-mkt',     name: 'Marketing',           color: '#f59e0b' },
  { id: 'dept-product', name: 'Sản phẩm (Product)',  color: '#3b82f6' },
  { id: 'dept-ops',     name: 'Vận hành (Ops)',      color: '#ef4444' },
  { id: 'dept-it',      name: 'IT',                  color: '#0891b2' },
]

export const DEPT_MAP = Object.fromEntries(mockDepartments.map((d) => [d.id, d]))
