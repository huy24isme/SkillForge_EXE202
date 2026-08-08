import { PageHeader } from '../../components/layout/PageHeader.jsx'
import { StrategyMapCanvas } from './StrategyMapCanvas.jsx'

export default function StrategyMapPage() {
  return (
    <div className="flex flex-col h-full -m-6">
      <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-200 flex-shrink-0">
        <PageHeader
          title="Bản đồ chiến lược"
          subtitle="Mối quan hệ nhân-quả giữa các mục tiêu theo 4 góc nhìn BSC"
          className="mb-0"
        />
      </div>
      <div className="flex-1 relative" style={{ height: 'calc(100vh - 14rem)' }}>
        <StrategyMapCanvas />
      </div>
    </div>
  )
}
