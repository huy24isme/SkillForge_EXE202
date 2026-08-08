import { useState } from 'react'
import { Download, FileSpreadsheet, CheckCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { useKPIStore } from '../../store/kpiStore.js'
import { calcCompletion, getRating } from '../../constants/kpiRating.js'
import { mockDepartments, DEPT_MAP } from '../../data/mockDepartments.js'
import { USER_MAP } from '../../data/mockUsers.js'
import { MONTHS } from '../../constants/periods.js'
import { Card, CardHeader } from '../../components/ui/Card.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function ExportPanel() {
  const { kpis, results } = useKPIStore()
  const [exporting, setExporting] = useState(false)
  const [done, setDone] = useState(false)

  async function handleExport() {
    setExporting(true)
    await new Promise(r => setTimeout(r, 400))

    const wb = XLSX.utils.book_new()

    // Sheet 1: Danh sách KPI
    const kpiRows = kpis.map(k => ({
      'Tên KPI': k.name,
      'Cấp': { company: 'Công ty', department: 'Phòng ban', individual: 'Cá nhân' }[k.level] ?? k.level,
      'Đơn vị': k.unit,
      'Trọng số (%)': k.weight,
      'Kỳ đánh giá': { monthly: 'Tháng', quarterly: 'Quý', yearly: 'Năm' }[k.periodType],
      'Phòng ban': DEPT_MAP[k.deptId]?.name ?? k.deptId,
      'Người phụ trách': USER_MAP[k.ownerId]?.name ?? k.ownerId,
    }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(kpiRows), 'Danh sách KPI')

    // Sheet 2: Kết quả theo tháng (company KPIs only)
    const companyKPIs = kpis.filter(k => k.level === 'company')
    const resultRows = companyKPIs.map(kpi => {
      const row = { 'Tên KPI': kpi.name, 'Đơn vị': kpi.unit }
      MONTHS.forEach(m => {
        const res = results.find(r => r.kpiId === kpi.id && r.period === m.id)
        const target = kpi.targetValues?.[m.id]
        const actual = res?.actualValue
        const pct = actual != null && target ? calcCompletion(actual, target) : null
        row[`${m.short} - Mục tiêu`] = target ?? ''
        row[`${m.short} - Thực tế`] = actual ?? ''
        row[`${m.short} - % HT`] = pct != null ? `${pct.toFixed(1)}%` : ''
        row[`${m.short} - Đánh giá`] = pct != null ? getRating(pct).label : ''
      })
      return row
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resultRows), 'Kết quả theo kỳ')

    // Sheet 3: So sánh phòng ban (Q1)
    const deptRows = mockDepartments.map(dept => {
      const deptKPIs = kpis.filter(k => k.deptId === dept.id && k.level !== 'individual')
      let totalWeight = 0, weightedSum = 0
      deptKPIs.forEach(kpi => {
        const res = results.find(r => r.kpiId === kpi.id && r.period === 'Q1-2024')
        const target = kpi.targetValues?.['Q1-2024']
        if (res && target) {
          const pct = calcCompletion(res.actualValue, target)
          totalWeight += kpi.weight
          weightedSum += pct * kpi.weight
        }
      })
      const avg = totalWeight > 0 ? weightedSum / totalWeight : null
      return {
        'Phòng ban': dept.name,
        'Số KPI': deptKPIs.length,
        'Hoàn thành TB (%)': avg != null ? `${avg.toFixed(1)}%` : '—',
        'Đánh giá': avg != null ? getRating(avg).label : '—',
      }
    })
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(deptRows), 'So sánh phòng ban')

    XLSX.writeFile(wb, `BSC-KPI_BaoCao_${new Date().toISOString().split('T')[0]}.xlsx`)
    setExporting(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <Card className="max-w-xl">
      <CardHeader title="Xuất báo cáo Excel" subtitle="File .xlsx nhiều sheet, mở được bằng Microsoft Excel / Google Sheets" />

      <div className="space-y-3 mb-6">
        {[
          { icon: '📋', label: 'Danh sách KPI', desc: 'Tất cả KPI với thông tin chi tiết' },
          { icon: '📊', label: 'Kết quả theo kỳ', desc: 'Mục tiêu, thực tế, % hoàn thành từng tháng' },
          { icon: '🏢', label: 'So sánh phòng ban', desc: 'Tổng hợp hoàn thành theo phòng ban Q1/2024' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="text-sm font-semibold text-slate-700">Sheet: {item.label}</div>
              <div className="text-xs text-slate-400">{item.desc}</div>
            </div>
            <CheckCircle size={16} className="text-green-500 ml-auto flex-shrink-0" />
          </div>
        ))}
      </div>

      <Button
        onClick={handleExport}
        disabled={exporting}
        size="lg"
        className="w-full justify-center"
        icon={done ? <CheckCircle size={18} /> : <Download size={18} />}
        variant={done ? 'success' : 'primary'}
      >
        {exporting ? 'Đang tạo file...' : done ? 'Đã tải xuống!' : 'Xuất Excel (.xlsx)'}
      </Button>
    </Card>
  )
}
