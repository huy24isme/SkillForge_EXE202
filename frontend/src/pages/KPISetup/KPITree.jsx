import { useState } from 'react'
import { useKPIStore } from '../../store/kpiStore.js'
import { buildKPITree } from '../../utils/kpiHelpers.js'
import { PERSPECTIVE_MAP } from '../../constants/bsc.js'
import { Card } from '../../components/ui/Card.jsx'
import { KPITreeNode } from './KPITreeNode.jsx'

export function KPITree({ onEdit, onAddChild }) {
  const { kpis } = useKPIStore()
  const tree = buildKPITree(kpis)

  return (
    <Card padding={false}>
      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 rounded-t-xl">
        <div className="grid grid-cols-12 text-xs font-semibold text-slate-500 uppercase tracking-wide">
          <div className="col-span-5">Tên KPI</div>
          <div className="col-span-1 text-center">Góc nhìn</div>
          <div className="col-span-1 text-center">Đơn vị</div>
          <div className="col-span-1 text-center">Trọng số</div>
          <div className="col-span-2 text-center">Kỳ đánh giá</div>
          <div className="col-span-2 text-right">Thao tác</div>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {tree.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">Chưa có KPI nào. Thêm KPI đầu tiên.</div>
        )}
        {tree.map(node => (
          <KPITreeNode key={node.id} node={node} depth={0} onEdit={onEdit} onAddChild={onAddChild} />
        ))}
      </div>
    </Card>
  )
}
