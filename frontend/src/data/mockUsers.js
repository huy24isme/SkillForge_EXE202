export const mockUsers = [
  { id: 'usr-000', name: 'Nguyễn Thành Công',  email: 'cong.nt@thienphu.vn',  role: 'admin',   deptId: 'dept-bgd', title: 'Giám đốc' },
  { id: 'usr-001', name: 'Trần Minh Tuấn',     email: 'tuan.tm@thienphu.vn',  role: 'manager', deptId: 'dept-kd',  title: 'Trưởng phòng Kinh doanh' },
  { id: 'usr-002', name: 'Lê Thị Hương',       email: 'huong.lt@thienphu.vn', role: 'manager', deptId: 'dept-kt',  title: 'Trưởng phòng Kế toán' },
  { id: 'usr-003', name: 'Phạm Thị Mai',       email: 'mai.pt@thienphu.vn',   role: 'manager', deptId: 'dept-nv',  title: 'Trưởng phòng Nhân sự' },
  { id: 'usr-004', name: 'Hoàng Văn Bình',     email: 'binh.hv@thienphu.vn',  role: 'manager', deptId: 'dept-sx',  title: 'Trưởng phòng Sản xuất' },
  { id: 'usr-005', name: 'Vũ Đức Long',        email: 'long.vd@thienphu.vn',  role: 'manager', deptId: 'dept-it',  title: 'Trưởng phòng CNTT' },
  { id: 'usr-011', name: 'Ngô Thị Lan',        email: 'lan.nt@thienphu.vn',   role: 'staff',   deptId: 'dept-kd',  title: 'Chuyên viên Kinh doanh' },
  { id: 'usr-012', name: 'Đặng Quốc Huy',     email: 'huy.dq@thienphu.vn',   role: 'staff',   deptId: 'dept-kd',  title: 'Chuyên viên Kinh doanh' },
  { id: 'usr-021', name: 'Bùi Thị Ngọc',      email: 'ngoc.bt@thienphu.vn',  role: 'staff',   deptId: 'dept-kt',  title: 'Kế toán viên' },
  { id: 'usr-031', name: 'Cao Thị Thu',        email: 'thu.ct@thienphu.vn',   role: 'staff',   deptId: 'dept-nv',  title: 'Chuyên viên Nhân sự' },
  { id: 'usr-041', name: 'Đinh Văn Hải',      email: 'hai.dv@thienphu.vn',   role: 'staff',   deptId: 'dept-sx',  title: 'Tổ trưởng Sản xuất' },
]

export const USER_MAP = Object.fromEntries(mockUsers.map(u => [u.id, u]))
