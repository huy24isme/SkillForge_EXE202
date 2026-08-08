import { useState } from 'react'
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, User } from 'lucide-react'
import { useKPIStore } from '../../store/kpiStore.js'
import { PERSPECTIVE_MAP } from '../../constants/bsc.js'
import { USER_MAP } from '../../data/mockUsers.js'
import { Badge } from '../../components/ui/Badge.jsx'
import clsx from 'clsx'

const PERIOD_LABELS = { monthly: 'Tháng', quarterly: 'Quý', yearly: 'Năm' }
const LEVEL_COLORS = { company: 'blue', department: 'purple', individual: 'slate' }

export function KPITreeNode({ node, depth, onEdit, onAddChild }) {
  const [open, setOpen] = useState(depth < 1)
  const { deleteKPI } = useKPIStore()
  const perspective = PERSPECTIVE_MAP[node.perspectiveId]
  const owner = USER_MAP[node.ownerId]
  const hasChildren = node._children?.length > 0

  function handleDelete() {
    if (confirm(`Xóa KPI "${node.name}"?`)) deleteKPI(node.id)
  }

  return (
    <div>
      <div className={clsx(
        'px-5 py-2.5 hover:bg-slate-50 group transition-colors',
        depth === 0 ? '' : depth === 1 ? 'bg-slate-50/50' : 'bg-slate-50'
      )}>
        <div className="grid grid-cols-12 items-center gap-2">
          {/* Name */}
          <div className="col-span-5 flex items-center gap-1.5" style={{ paddingLeft: depth * 20 }}>
            {hasChildren ? (
              <button onClick={() => setOpen(o => !o)} className="text-slate-400 hover:text-slate-600 cursor-pointer flex-shrink-0">
                {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : <span className="w-3.5" />}
            <div>
              <div className="font-medium text-slate-800 text-sm">{node.name}</div>
              {owner && (
                <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                  <User size={10} />{owner.name}
                </div>
              )}
            </div>
          </div>

          {/* Perspective */}
          <div className="col-span-1 text-center">
            {perspective && (
              <span className="text-xs font-medium rounded-full px-2 py-0.5" style={{ backgroundColor: `${perspective.color}15`, color: perspective.color }}>
                {perspective.label.split(' ')[0]}
              </span>
            )}
          </div>

          {/* Unit */}
          <div className="col-span-1 text-center">
            <span className="text-sm text-slate-500">{node.unit}</span>
          </div>

          {/* Weight */}
          <div className="col-span-1 text-center">
            <Badge color={LEVEL_COLORS[node.level] ?? 'slate'}>{node.weight}%</Badge>
          </div>

          {/* Period */}
          <div className="col-span-2 text-center">
            <span className="text-sm text-slate-500">{PERIOD_LABELS[node.periodType]}</span>
          </div>

          {/* Actions */}
          <div className="col-span-2 flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            {node.level !== 'individual' && (
              <button onClick={() => onAddChild?.(node)} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded cursor-pointer" title="Thêm KPI con">
                <Plus size={14} />
              </button>
            )}
            <button onClick={() => onEdit?.(node)} className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer" title="Chỉnh sửa">
              <Pencil size={14} />
            </button>
            <button onClick={handleDelete} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer" title="Xóa">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Children */}
      {open && hasChildren && node._children.map(child => (
        <KPITreeNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onAddChild={onAddChild} />
      ))}
    </div>
  )
}
