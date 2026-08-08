// Sample actual values for Jan-Mar 2024
// completionPct = (actual/target)*100 — computed at runtime, not stored here

export const mockKPIResults = [
  // kpi-f1: Doanh thu thuần (target T01=9)
  { id: 'r-f1-t01', kpiId: 'kpi-f1', period: 'T01-2024', actualValue: 9.8,  note: 'Vượt kế hoạch, ký được hợp đồng lớn', enteredBy: 'usr-002', enteredAt: '2024-01-31' },
  { id: 'r-f1-t02', kpiId: 'kpi-f1', period: 'T02-2024', actualValue: 8.4,  note: 'Thấp hơn kế hoạch do tháng Tết', enteredBy: 'usr-002', enteredAt: '2024-02-29' },
  { id: 'r-f1-t03', kpiId: 'kpi-f1', period: 'T03-2024', actualValue: 10.1, note: 'Phục hồi tốt sau Tết', enteredBy: 'usr-002', enteredAt: '2024-03-31' },

  // kpi-f2: Tăng trưởng (target Q1=20%)
  { id: 'r-f2-q1', kpiId: 'kpi-f2', period: 'Q1-2024', actualValue: 22, note: '', enteredBy: 'usr-002', enteredAt: '2024-04-05' },

  // kpi-f3: Tỷ lệ lợi nhuận (target Q1=12%)
  { id: 'r-f3-q1', kpiId: 'kpi-f3', period: 'Q1-2024', actualValue: 13.5, note: 'Tốt hơn dự kiến', enteredBy: 'usr-002', enteredAt: '2024-04-05' },

  // kpi-c1: NPS (target Q1=45)
  { id: 'r-c1-q1', kpiId: 'kpi-c1', period: 'Q1-2024', actualValue: 48, note: 'Khảo sát 150 khách hàng', enteredBy: 'usr-001', enteredAt: '2024-04-03' },

  // kpi-c2: Khách hàng mới
  { id: 'r-c2-t01', kpiId: 'kpi-c2', period: 'T01-2024', actualValue: 22, note: '', enteredBy: 'usr-001', enteredAt: '2024-01-31' },
  { id: 'r-c2-t02', kpiId: 'kpi-c2', period: 'T02-2024', actualValue: 15, note: 'Tháng Tết ít giao dịch', enteredBy: 'usr-001', enteredAt: '2024-02-29' },
  { id: 'r-c2-t03', kpiId: 'kpi-c2', period: 'T03-2024', actualValue: 25, note: '', enteredBy: 'usr-001', enteredAt: '2024-03-31' },

  // kpi-c4: Giữ chân khách (target Q1=82%)
  { id: 'r-c4-q1', kpiId: 'kpi-c4', period: 'Q1-2024', actualValue: 80, note: 'Cần cải thiện thêm', enteredBy: 'usr-001', enteredAt: '2024-04-03' },

  // kpi-i1: Thời gian SX (target T01=12, LOWER IS BETTER)
  { id: 'r-i1-t01', kpiId: 'kpi-i1', period: 'T01-2024', actualValue: 11, note: '', enteredBy: 'usr-004', enteredAt: '2024-01-31' },
  { id: 'r-i1-t02', kpiId: 'kpi-i1', period: 'T02-2024', actualValue: 12.5, note: 'Máy bị sự cố 2 ngày', enteredBy: 'usr-004', enteredAt: '2024-02-29' },
  { id: 'r-i1-t03', kpiId: 'kpi-i1', period: 'T03-2024', actualValue: 10.8, note: '', enteredBy: 'usr-004', enteredAt: '2024-03-31' },

  // kpi-i2: Giao hàng đúng hạn
  { id: 'r-i2-t01', kpiId: 'kpi-i2', period: 'T01-2024', actualValue: 90, note: '', enteredBy: 'usr-004', enteredAt: '2024-01-31' },
  { id: 'r-i2-t02', kpiId: 'kpi-i2', period: 'T02-2024', actualValue: 85, note: '', enteredBy: 'usr-004', enteredAt: '2024-02-29' },
  { id: 'r-i2-t03', kpiId: 'kpi-i2', period: 'T03-2024', actualValue: 92, note: '', enteredBy: 'usr-004', enteredAt: '2024-03-31' },

  // kpi-i3: Tỷ lệ lỗi (target T01=3, LOWER IS BETTER)
  { id: 'r-i3-t01', kpiId: 'kpi-i3', period: 'T01-2024', actualValue: 2.5, note: '', enteredBy: 'usr-004', enteredAt: '2024-01-31' },
  { id: 'r-i3-t02', kpiId: 'kpi-i3', period: 'T02-2024', actualValue: 3.2, note: 'Lô hàng mới bị lỗi nguyên liệu', enteredBy: 'usr-004', enteredAt: '2024-02-29' },
  { id: 'r-i3-t03', kpiId: 'kpi-i3', period: 'T03-2024', actualValue: 2.2, note: '', enteredBy: 'usr-004', enteredAt: '2024-03-31' },

  // kpi-i4: Số hóa quy trình (target Q1=30%)
  { id: 'r-i4-q1', kpiId: 'kpi-i4', period: 'Q1-2024', actualValue: 28, note: 'Đang triển khai module HR', enteredBy: 'usr-005', enteredAt: '2024-04-03' },

  // kpi-l1: Giờ đào tạo (target Q1=8)
  { id: 'r-l1-q1', kpiId: 'kpi-l1', period: 'Q1-2024', actualValue: 9, note: '', enteredBy: 'usr-003', enteredAt: '2024-04-02' },

  // kpi-l2: Hoàn thành đào tạo (target Q1=70%)
  { id: 'r-l2-q1', kpiId: 'kpi-l2', period: 'Q1-2024', actualValue: 75, note: '', enteredBy: 'usr-003', enteredAt: '2024-04-02' },

  // kpi-l3: Sáng kiến (target Q1=15)
  { id: 'r-l3-q1', kpiId: 'kpi-l3', period: 'Q1-2024', actualValue: 12, note: 'Cần đẩy mạnh phong trào', enteredBy: 'usr-003', enteredAt: '2024-04-02' },

  // kpi-l4: Tỷ lệ nghỉ việc (target Q1=3%, LOWER IS BETTER)
  { id: 'r-l4-q1', kpiId: 'kpi-l4', period: 'Q1-2024', actualValue: 2.8, note: '', enteredBy: 'usr-003', enteredAt: '2024-04-02' },

  // Department KPIs
  { id: 'r-f1-kd-t01', kpiId: 'kpi-f1-kd', period: 'T01-2024', actualValue: 6.9, note: '', enteredBy: 'usr-001', enteredAt: '2024-01-31' },
  { id: 'r-f1-kd-t02', kpiId: 'kpi-f1-kd', period: 'T02-2024', actualValue: 5.8, note: 'Tháng Tết', enteredBy: 'usr-001', enteredAt: '2024-02-29' },
  { id: 'r-f1-kd-t03', kpiId: 'kpi-f1-kd', period: 'T03-2024', actualValue: 7.1, note: '', enteredBy: 'usr-001', enteredAt: '2024-03-31' },
  { id: 'r-c2-kd1-t01', kpiId: 'kpi-c2-kd1', period: 'T01-2024', actualValue: 12, note: '', enteredBy: 'usr-011', enteredAt: '2024-01-31' },
  { id: 'r-c2-kd1-t02', kpiId: 'kpi-c2-kd1', period: 'T02-2024', actualValue: 8,  note: '', enteredBy: 'usr-011', enteredAt: '2024-02-29' },
  { id: 'r-c2-kd2-t01', kpiId: 'kpi-c2-kd2', period: 'T01-2024', actualValue: 10, note: '', enteredBy: 'usr-012', enteredAt: '2024-01-31' },
  { id: 'r-c2-kd2-t02', kpiId: 'kpi-c2-kd2', period: 'T02-2024', actualValue: 7,  note: '', enteredBy: 'usr-012', enteredAt: '2024-02-29' },
]
