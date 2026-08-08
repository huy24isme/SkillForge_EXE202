import { PageHeader } from '../../components/layout/PageHeader.jsx'
import { KPIEntryTable } from './KPIEntryTable.jsx'
import { useUIStore } from '../../store/uiStore.js'

export default function KPIEntryPage() {
  const { activePeriod } = useUIStore()
  return (
    <div>
      <PageHeader
        title="Nhập liệu KPI"
        subtitle="Nhập kết quả thực tế và xem đánh giá hoàn thành theo thời gian thực"
      />
      <KPIEntryTable period={activePeriod} />
    </div>
  )
}
