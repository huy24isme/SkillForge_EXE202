// KPI Tree: Company → Department → Individual
// targetValues keyed by period id (T01-2024 ... T12-2024, Q1-Q4, NAM-2024)

function monthlyTargets(base, growthPct = 0) {
  const result = {}
  for (let m = 1; m <= 12; m++) {
    const key = `T${String(m).padStart(2, '0')}-2024`
    result[key] = +(base * (1 + (growthPct / 100) * (m - 1) / 11)).toFixed(2)
  }
  result[`Q1-2024`] = +(result['T01-2024'] + result['T02-2024'] + result['T03-2024']).toFixed(2)
  result[`Q2-2024`] = +(result['T04-2024'] + result['T05-2024'] + result['T06-2024']).toFixed(2)
  result[`Q3-2024`] = +(result['T07-2024'] + result['T08-2024'] + result['T09-2024']).toFixed(2)
  result[`Q4-2024`] = +(result['T10-2024'] + result['T11-2024'] + result['T12-2024']).toFixed(2)
  result[`NAM-2024`] = +(base * 12 * (1 + growthPct / 200)).toFixed(2)
  return result
}

export const mockKPIs = [
  // ============ COMPANY LEVEL ============
  {
    id: 'kpi-f1', parentId: null, level: 'company', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Doanh thu thuần', unit: 'Tỷ đồng', weight: 30, periodType: 'monthly',
    targetValues: monthlyTargets(9, 25),
    ownerId: 'usr-000', deptId: 'dept-bgd', children: ['kpi-f1-kd', 'kpi-f1-sx'],
  },
  {
    id: 'kpi-f2', parentId: null, level: 'company', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Tăng trưởng doanh thu (%)', unit: '%', weight: 10, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 20, 'Q2-2024': 22, 'Q3-2024': 25, 'Q4-2024': 28, 'NAM-2024': 25 },
    ownerId: 'usr-000', deptId: 'dept-bgd', children: [],
  },
  {
    id: 'kpi-f3', parentId: null, level: 'company', perspectiveId: 'financial', objectiveId: 'so-f2',
    name: 'Tỷ lệ lợi nhuận ròng', unit: '%', weight: 15, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 12, 'Q2-2024': 14, 'Q3-2024': 15, 'Q4-2024': 16, 'NAM-2024': 15 },
    ownerId: 'usr-002', deptId: 'dept-kt', children: [],
  },
  {
    id: 'kpi-f4', parentId: null, level: 'company', perspectiveId: 'financial', objectiveId: 'so-f3',
    name: 'Tỷ lệ chi phí / doanh thu', unit: '%', weight: 10, periodType: 'monthly',
    targetValues: monthlyTargets(65, -5),
    ownerId: 'usr-002', deptId: 'dept-kt', children: [],
  },
  {
    id: 'kpi-c1', parentId: null, level: 'company', perspectiveId: 'customer', objectiveId: 'so-c1',
    name: 'Điểm NPS (Net Promoter Score)', unit: 'điểm', weight: 10, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 45, 'Q2-2024': 48, 'Q3-2024': 50, 'Q4-2024': 52, 'NAM-2024': 50 },
    ownerId: 'usr-001', deptId: 'dept-kd', children: [],
  },
  {
    id: 'kpi-c2', parentId: null, level: 'company', perspectiveId: 'customer', objectiveId: 'so-c2',
    name: 'Số khách hàng mới', unit: 'khách', weight: 8, periodType: 'monthly',
    targetValues: monthlyTargets(20, 10),
    ownerId: 'usr-001', deptId: 'dept-kd', children: ['kpi-c2-kd1', 'kpi-c2-kd2'],
  },
  {
    id: 'kpi-c3', parentId: null, level: 'company', perspectiveId: 'customer', objectiveId: 'so-c2',
    name: 'Thị phần (%)', unit: '%', weight: 7, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 8, 'Q2-2024': 9, 'Q3-2024': 10, 'Q4-2024': 11, 'NAM-2024': 10 },
    ownerId: 'usr-000', deptId: 'dept-bgd', children: [],
  },
  {
    id: 'kpi-c4', parentId: null, level: 'company', perspectiveId: 'customer', objectiveId: 'so-c3',
    name: 'Tỷ lệ giữ chân khách hàng', unit: '%', weight: 5, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 82, 'Q2-2024': 84, 'Q3-2024': 85, 'Q4-2024': 87, 'NAM-2024': 85 },
    ownerId: 'usr-001', deptId: 'dept-kd', children: [],
  },
  {
    id: 'kpi-i1', parentId: null, level: 'company', perspectiveId: 'internal', objectiveId: 'so-i1',
    name: 'Thời gian sản xuất trung bình', unit: 'ngày', weight: 5, periodType: 'monthly',
    targetValues: monthlyTargets(12, -12),
    ownerId: 'usr-004', deptId: 'dept-sx', children: ['kpi-i1-sx1'],
  },
  {
    id: 'kpi-i2', parentId: null, level: 'company', perspectiveId: 'internal', objectiveId: 'so-i1',
    name: 'Tỷ lệ giao hàng đúng hạn', unit: '%', weight: 5, periodType: 'monthly',
    targetValues: monthlyTargets(88, 5),
    ownerId: 'usr-004', deptId: 'dept-sx', children: [],
  },
  {
    id: 'kpi-i3', parentId: null, level: 'company', perspectiveId: 'internal', objectiveId: 'so-i2',
    name: 'Tỷ lệ lỗi sản phẩm', unit: '%', weight: 3, periodType: 'monthly',
    targetValues: monthlyTargets(3, -25),
    ownerId: 'usr-004', deptId: 'dept-sx', children: [],
  },
  {
    id: 'kpi-i4', parentId: null, level: 'company', perspectiveId: 'internal', objectiveId: 'so-i3',
    name: 'Quy trình đã số hóa', unit: '%', weight: 2, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 30, 'Q2-2024': 45, 'Q3-2024': 55, 'Q4-2024': 65, 'NAM-2024': 60 },
    ownerId: 'usr-005', deptId: 'dept-it', children: [],
  },
  {
    id: 'kpi-l1', parentId: null, level: 'company', perspectiveId: 'learning', objectiveId: 'so-l1',
    name: 'Giờ đào tạo / nhân viên / năm', unit: 'giờ', weight: 3, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 8, 'Q2-2024': 10, 'Q3-2024': 11, 'Q4-2024': 11, 'NAM-2024': 40 },
    ownerId: 'usr-003', deptId: 'dept-nv', children: [],
  },
  {
    id: 'kpi-l2', parentId: null, level: 'company', perspectiveId: 'learning', objectiveId: 'so-l1',
    name: 'Tỷ lệ nhân viên hoàn thành đào tạo', unit: '%', weight: 2, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 70, 'Q2-2024': 80, 'Q3-2024': 85, 'Q4-2024': 90, 'NAM-2024': 85 },
    ownerId: 'usr-003', deptId: 'dept-nv', children: [],
  },
  {
    id: 'kpi-l3', parentId: null, level: 'company', perspectiveId: 'learning', objectiveId: 'so-l2',
    name: 'Số sáng kiến được đề xuất', unit: 'ý tưởng', weight: 2, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 15, 'Q2-2024': 18, 'Q3-2024': 20, 'Q4-2024': 22, 'NAM-2024': 75 },
    ownerId: 'usr-000', deptId: 'dept-bgd', children: [],
  },
  {
    id: 'kpi-l4', parentId: null, level: 'company', perspectiveId: 'learning', objectiveId: 'so-l3',
    name: 'Tỷ lệ nghỉ việc', unit: '%', weight: 3, periodType: 'quarterly',
    targetValues: { 'Q1-2024': 3, 'Q2-2024': 3, 'Q3-2024': 3, 'Q4-2024': 3, 'NAM-2024': 12 },
    ownerId: 'usr-003', deptId: 'dept-nv', children: [],
  },

  // ============ DEPARTMENT LEVEL ============
  {
    id: 'kpi-f1-kd', parentId: 'kpi-f1', level: 'department', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Doanh thu Phòng Kinh doanh', unit: 'Tỷ đồng', weight: 70, periodType: 'monthly',
    targetValues: monthlyTargets(6.3, 25),
    ownerId: 'usr-001', deptId: 'dept-kd', children: ['kpi-f1-kd-u1', 'kpi-f1-kd-u2'],
  },
  {
    id: 'kpi-f1-sx', parentId: 'kpi-f1', level: 'department', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Doanh thu Phòng Sản xuất', unit: 'Tỷ đồng', weight: 30, periodType: 'monthly',
    targetValues: monthlyTargets(2.7, 25),
    ownerId: 'usr-004', deptId: 'dept-sx', children: [],
  },
  {
    id: 'kpi-c2-kd1', parentId: 'kpi-c2', level: 'department', perspectiveId: 'customer', objectiveId: 'so-c2',
    name: 'Khách hàng mới - Miền Bắc', unit: 'khách', weight: 50, periodType: 'monthly',
    targetValues: monthlyTargets(10, 10),
    ownerId: 'usr-011', deptId: 'dept-kd', children: [],
  },
  {
    id: 'kpi-c2-kd2', parentId: 'kpi-c2', level: 'department', perspectiveId: 'customer', objectiveId: 'so-c2',
    name: 'Khách hàng mới - Miền Nam', unit: 'khách', weight: 50, periodType: 'monthly',
    targetValues: monthlyTargets(10, 10),
    ownerId: 'usr-012', deptId: 'dept-kd', children: [],
  },
  {
    id: 'kpi-i1-sx1', parentId: 'kpi-i1', level: 'department', perspectiveId: 'internal', objectiveId: 'so-i1',
    name: 'Thời gian sản xuất - Dây chuyền A', unit: 'ngày', weight: 100, periodType: 'monthly',
    targetValues: monthlyTargets(12, -12),
    ownerId: 'usr-041', deptId: 'dept-sx', children: [],
  },

  // ============ INDIVIDUAL LEVEL ============
  {
    id: 'kpi-f1-kd-u1', parentId: 'kpi-f1-kd', level: 'individual', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Doanh thu cá nhân - Ngô Thị Lan', unit: 'Tỷ đồng', weight: 50, periodType: 'monthly',
    targetValues: monthlyTargets(3.15, 25),
    ownerId: 'usr-011', deptId: 'dept-kd', children: [],
  },
  {
    id: 'kpi-f1-kd-u2', parentId: 'kpi-f1-kd', level: 'individual', perspectiveId: 'financial', objectiveId: 'so-f1',
    name: 'Doanh thu cá nhân - Đặng Quốc Huy', unit: 'Tỷ đồng', weight: 50, periodType: 'monthly',
    targetValues: monthlyTargets(3.15, 25),
    ownerId: 'usr-012', deptId: 'dept-kd', children: [],
  },
]

export const KPI_MAP = Object.fromEntries(mockKPIs.map(k => [k.id, k]))
