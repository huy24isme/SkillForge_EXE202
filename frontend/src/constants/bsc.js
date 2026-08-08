export const PERSPECTIVES = [
  { id: 'financial', label: 'Tài chính', order: 1, color: '#16a34a', bgColor: '#f0fdf4', borderColor: '#86efac', icon: '💰' },
  { id: 'customer',  label: 'Khách hàng', order: 2, color: '#2563eb', bgColor: '#eff6ff', borderColor: '#93c5fd', icon: '🤝' },
  { id: 'internal',  label: 'Quy trình nội bộ', order: 3, color: '#9333ea', bgColor: '#faf5ff', borderColor: '#d8b4fe', icon: '⚙️' },
  { id: 'learning',  label: 'Học hỏi & Phát triển', order: 4, color: '#d97706', bgColor: '#fffbeb', borderColor: '#fcd34d', icon: '📚' },
]

export const PERSPECTIVE_MAP = Object.fromEntries(PERSPECTIVES.map(p => [p.id, p]))
