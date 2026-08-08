import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X, Edit3, Trash2, ChevronRight, ArrowRight, AlertCircle, Check, GitMerge } from 'lucide-react'
import clsx from 'clsx'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { toast } from '../../components/ui/toast.jsx'

const PERSPECTIVES = [
  { key: 'FINANCIAL',           label: 'Tài chính',             color: '#16a34a', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  { key: 'CUSTOMER',            label: 'Khách hàng',            color: '#2563eb', bg: 'bg-blue-50',    border: 'border-blue-200',    badge: 'bg-blue-100 text-blue-700' },
  { key: 'INTERNAL_PROCESS',    label: 'Quy trình nội bộ',      color: '#9333ea', bg: 'bg-purple-50',  border: 'border-purple-200',  badge: 'bg-purple-100 text-purple-700' },
  { key: 'LEARNING_AND_GROWTH', label: 'Học hỏi & phát triển', color: '#d97706', bg: 'bg-amber-50',   border: 'border-amber-200',   badge: 'bg-amber-100 text-amber-700' },
]

const P_MAP = Object.fromEntries(PERSPECTIVES.map((p) => [p.key, p]))

// ── Add / Edit Objective Modal ────────────────────────────────
function ObjectiveModal({ open, onClose, onSave, initial, perspective }) {
  const [name, setName] = useState(initial?.name ?? '')
  const [desc, setDesc] = useState(initial?.description ?? '')
  const [persp, setPersp] = useState(initial?.perspective ?? perspective ?? 'FINANCIAL')

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? '')
      setDesc(initial?.description ?? '')
      setPersp(initial?.perspective ?? perspective ?? 'FINANCIAL')
    }
  }, [open, initial, perspective])

  if (!open) return null
  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name, description: desc, perspective: persp })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800">{initial ? 'Chỉnh sửa mục tiêu' : 'Thêm mục tiêu chiến lược'}</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Góc độ BSC</label>
            <div className="grid grid-cols-2 gap-2">
              {PERSPECTIVES.map((p2) => (
                <button
                  key={p2.key}
                  onClick={() => setPersp(p2.key)}
                  className={clsx('flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-xs font-semibold transition-all',
                    persp === p2.key ? 'border-current' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  )}
                  style={persp === p2.key ? { borderColor: p2.color, color: p2.color, background: `${p2.color}10` } : {}}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p2.color }} />
                  {p2.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tên mục tiêu <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="VD: Tăng doanh thu từ khách hàng SME..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mô tả (tuỳ chọn)</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 resize-none"
              rows={2}
              placeholder="Mô tả chi tiết..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">Hủy</button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl transition-colors"
          >
            {initial ? 'Cập nhật' : 'Thêm mục tiêu'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Merge Modal ───────────────────────────────────────────────
function MergeModal({ open, onClose, onMerge, selectedObjs }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  useEffect(() => { if (open) { setName(''); setDesc('') } }, [open])
  if (!open || selectedObjs.length < 2) return null
  const perspective = selectedObjs[0]?.perspective
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><GitMerge size={16} className="text-purple-600" /> Gộp mục tiêu</h3>
          <button onClick={onClose}><X size={18} className="text-slate-400" /></button>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 mb-4">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Mục tiêu được gộp ({P_MAP[perspective]?.label}):</p>
          {selectedObjs.map((o) => (
            <div key={o.id} className="flex items-center gap-2 text-xs text-slate-700 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              {o.name}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tên mục tiêu mới <span className="text-red-500">*</span></label>
            <input
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500"
              placeholder="Tên mục tiêu sau khi gộp..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Mô tả</label>
            <textarea className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-500 resize-none" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium">Hủy</button>
          <button
            onClick={() => { if (name.trim()) { onMerge(selectedObjs.map((o) => o.id), name, desc, perspective); onClose() } }}
            disabled={!name.trim()}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-xl transition-colors"
          >
            Xác nhận gộp
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Perspective Lane ──────────────────────────────────────────
function PerspectiveLane({ perspective: p, objectives, onAdd, onEdit, onRemove }) {
  return (
    <div className={clsx('rounded-xl border-2 overflow-hidden flex flex-col', p.border)}>
      <div className={clsx('px-3 py-2.5 flex items-center justify-between', p.bg)}>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide" style={{ color: p.color }}>{p.label}</span>
          <span className="text-xs text-slate-400 ml-2">{objectives.length} mục tiêu</span>
        </div>
        <button
          onClick={() => onAdd(p.key)}
          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg text-white transition-colors hover:opacity-90"
          style={{ background: p.color }}
        >
          <Plus size={12} /> Thêm
        </button>
      </div>
      <div className="flex-1 p-2 space-y-2 min-h-24 bg-white">
        {objectives.length === 0 ? (
          <div className="flex items-center justify-center h-16 text-xs text-slate-300 italic">Chưa có mục tiêu nào</div>
        ) : (
          objectives.map((obj) => (
            <div key={obj.id} className="group bg-white border border-slate-100 rounded-lg px-3 py-2 flex items-start gap-2 hover:shadow-sm transition-shadow">
              <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: p.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 leading-snug">{obj.name}</p>
                {obj.description && <p className="text-[10px] text-slate-400 mt-0.5 leading-snug line-clamp-2">{obj.description}</p>}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button onClick={() => onEdit(obj)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-slate-100">
                  <Edit3 size={10} className="text-slate-400" />
                </button>
                <button onClick={() => onRemove(obj.id)} className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-50">
                  <Trash2 size={10} className="text-red-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ── Merge Step ────────────────────────────────────────────────
function MergeStep({ strategyIds, strategies, strategyObjectives, mapStore }) {
  const [selected, setSelected] = useState([])
  const [mergeModalOpen, setMergeModalOpen] = useState(false)
  const [linkSource, setLinkSource] = useState('')
  const [linkTarget, setLinkTarget] = useState('')
  const { finalObjectives, finalCausalLinks, mergeDecisions, removeFinalObjective, addFinalCausalLink, removeFinalCausalLink } = mapStore

  const allSourceObjs = strategyIds.flatMap((sid) =>
    (strategyObjectives[sid] ?? []).map((o) => ({ ...o, strategyId: sid }))
  )

  const toggleSelect = (obj) => {
    const exists = selected.find((s) => s.id === obj.id)
    if (exists) { setSelected(selected.filter((s) => s.id !== obj.id)); return }
    if (selected.length > 0 && selected[0].perspective !== obj.perspective) return
    if (mergeDecisions[obj.id]) return
    setSelected([...selected, obj])
  }

  const samePersp = selected.length >= 2 && selected.every((s) => s.perspective === selected[0].perspective)

  const handleAddLink = () => {
    if (linkSource && linkTarget && linkSource !== linkTarget) {
      addFinalCausalLink(linkSource, linkTarget)
      setLinkSource(''); setLinkTarget('')
    }
  }

  return (
    <div className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
        <strong>Bước gộp bản đồ chiến lược:</strong> Nhấn <strong>Keep</strong> để giữ, <strong>Remove</strong> để loại, hoặc chọn nhiều mục tiêu cùng góc độ rồi <strong>Merge</strong> để gộp thành mục tiêu mới.
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {strategyIds.map((sid) => {
          const strat = strategies.find((s) => s.id === sid)
          return (
            <div key={sid} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <p className="text-xs font-bold text-slate-700">{strat?.name ?? sid}</p>
              </div>
              <div className="p-3 space-y-3">
                {PERSPECTIVES.map((p) => {
                  const objs = (strategyObjectives[sid] ?? []).filter((o) => o.perspective === p.key)
                  if (objs.length === 0) return null
                  return (
                    <div key={p.key}>
                      <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: p.color }}>{p.label}</p>
                      {objs.map((obj) => {
                        const dec = mergeDecisions[obj.id]
                        const isSelected = !!selected.find((s) => s.id === obj.id)
                        return (
                          <div
                            key={obj.id}
                            onClick={() => !dec && toggleSelect({ ...obj, strategyId: sid })}
                            className={clsx(
                              'flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-1 border transition-all',
                              isSelected ? 'border-purple-400 bg-purple-50 cursor-pointer' :
                              dec ? 'border-slate-100 bg-slate-50 opacity-50' :
                              'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                            )}
                          >
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                            <span className={clsx('flex-1', dec ? 'line-through text-slate-400' : 'text-slate-700')}>{obj.name}</span>
                            {dec === 'keep' && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded font-semibold">Keep</span>}
                            {dec === 'remove' && <span className="text-[10px] bg-red-100 text-red-500 px-1.5 py-0.5 rounded font-semibold">Removed</span>}
                            {dec?.startsWith('merged') && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-semibold">Merged</span>}
                            {!dec && (
                              <div className="flex gap-1 ml-1" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => mapStore.keepObjective(sid, obj.id)} className="text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-1.5 py-0.5 rounded font-semibold">Keep</button>
                                <button onClick={() => mapStore.removeFromMerge(obj.id)} className="text-[10px] bg-red-50 text-red-500 hover:bg-red-100 px-1.5 py-0.5 rounded font-semibold">Remove</button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selected.length >= 2 && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center gap-3">
          <GitMerge size={16} className="text-purple-600 shrink-0" />
          <p className="text-xs text-purple-700 flex-1">
            Đã chọn {selected.length} mục tiêu — Góc độ: {P_MAP[selected[0]?.perspective]?.label}
            {!samePersp && <span className="text-red-500 ml-2">(Chỉ được gộp cùng góc độ)</span>}
          </p>
          <button onClick={() => samePersp && setMergeModalOpen(true)} disabled={!samePersp} className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-lg">
            Gộp đã chọn
          </button>
          <button onClick={() => setSelected([])} className="text-xs text-slate-400 hover:text-slate-600">Bỏ chọn</button>
        </div>
      )}

      {finalObjectives.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-blue-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-blue-100 bg-blue-50">
            <p className="text-sm font-bold text-blue-800">Bản đồ chiến lược tổng ({finalObjectives.length} mục tiêu)</p>
          </div>
          <div className="p-4">
            <div className="space-y-1.5 mb-4">
              {PERSPECTIVES.map((p) => {
                const finals = finalObjectives.filter((f) => f.perspective === p.key)
                if (finals.length === 0) return null
                return (
                  <div key={p.key}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: p.color }}>{p.label}</p>
                    {finals.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-100 mb-1 text-xs bg-slate-50">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                        <span className="flex-1 font-medium text-slate-700">{f.name}</span>
                        <span className={clsx('text-[10px] px-1.5 py-0.5 rounded font-semibold', f.type === 'MERGED' ? 'bg-purple-100 text-purple-600' : f.type === 'MANUAL_EDITED' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600')}>
                          {f.type === 'MERGED' ? 'Gộp' : f.type === 'MANUAL_EDITED' ? 'Đã sửa' : 'Giữ nguyên'}
                        </span>
                        <button onClick={() => removeFinalObjective(f.id)} className="w-4 h-4 rounded flex items-center justify-center hover:bg-red-50"><X size={10} className="text-red-400" /></button>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 pt-3">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Liên kết nhân quả tổng</p>
              <div className="flex gap-2 mb-2">
                <select value={linkSource} onChange={(e) => setLinkSource(e.target.value)} className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white">
                  <option value="">Nguồn...</option>
                  {finalObjectives.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <ArrowRight size={16} className="text-slate-300 self-center shrink-0" />
                <select value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1.5 outline-none bg-white">
                  <option value="">Đích...</option>
                  {finalObjectives.filter((f) => f.id !== linkSource).map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
                <button onClick={handleAddLink} disabled={!linkSource || !linkTarget} className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-lg"><Plus size={13} /></button>
              </div>
              <div className="space-y-1">
                {finalCausalLinks.map((l) => {
                  const src = finalObjectives.find((f) => f.id === l.sourceId)
                  const tgt = finalObjectives.find((f) => f.id === l.targetId)
                  if (!src || !tgt) return null
                  return (
                    <div key={l.id} className="flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                      <span className="flex-1 truncate">{src.name} <ArrowRight size={10} className="inline mx-1" /> {tgt.name}</span>
                      <button onClick={() => removeFinalCausalLink(l.id)}><X size={10} className="text-red-300 hover:text-red-500" /></button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <MergeModal
        open={mergeModalOpen}
        onClose={() => { setMergeModalOpen(false); setSelected([]) }}
        onMerge={(ids, name, desc, persp) => { mapStore.mergeObjectives(ids, { name, description: desc, perspective: persp }); setSelected([]) }}
        selectedObjs={selected}
      />
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function PerspectivesPage() {
  const swotStore = useSWOTStore()
  const { strategies, b3Selected } = swotStore
  const mapStore = useStrategyMapStore()
  const navigate = useNavigate()
  const { strategyId } = useBscContextStore()

  const { strategyObjectives, strategyCausalLinks, addObjective, updateObjective, removeObjective, addCausalLink, removeCausalLink } = mapStore

  const [modal, setModal] = useState({ open: false, strategyId: null, perspective: null, editing: null })
  const [activeStrategyTab, setActiveStrategyTab] = useState(b3Selected[0] ?? null)
  const [viewMode, setViewMode] = useState('map')
  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)
  const [linkSource, setLinkSource] = useState('')
  const [linkTarget, setLinkTarget] = useState('')

  useEffect(() => {
    if (!strategyId) return
    let isMounted = true

    swotStore.fetch(strategyId).then(() => {
      if (!isMounted) return
      return mapStore.fetchFromBackend(strategyId)
    }).then(() => {
      if (!isMounted) return
      // Sau khi đã tải xong dữ liệu từ BE, kiểm tra xem có map nào bị thiếu không
      const currentB3Selected = useSWOTStore.getState().b3Selected
      const currentMapIds = useStrategyMapStore.getState().strategyMapIds
      const missing = currentB3Selected.filter((sid) => !currentMapIds[sid])

      if (missing.length > 0) {
        useStrategyMapStore.getState().initForStrategies(missing).then(() => {
          if (useStrategyMapStore.getState().error) {
            toast.error('Khởi tạo bản đồ chiến lược thất bại. Vui lòng tải lại trang.')
          }
        })
      }
    })

    return () => { isMounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  useEffect(() => {
    if (b3Selected.length === 0) return
    setActiveStrategyTab((prev) => prev ?? b3Selected[0])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b3Selected.join(',')])

  const selectedStrategies = b3Selected.map((id) => strategies.find((s) => s.id === id)).filter(Boolean)

  if (b3Selected.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <AlertCircle size={40} className="mx-auto mb-4 text-slate-300" />
        <p className="text-slate-400 text-sm mb-4">Chưa có chiến lược nào được chọn ở B3</p>
        <button onClick={() => navigate('/strategy-results/selection')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">Quay lại B3</button>
      </div>
    )
  }

  const activeStratObjs = strategyObjectives[activeStrategyTab] ?? []
  const activeStratLinks = strategyCausalLinks[activeStrategyTab] ?? []

  const handleAddObjective = (perspective) => setModal({ open: true, strategyId: activeStrategyTab, perspective, editing: null })
  const handleEditObjective = (obj) => setModal({ open: true, strategyId: activeStrategyTab, perspective: obj.perspective, editing: obj })
  const handleSaveObjective = ({ name, description, perspective }) => {
    if (modal.editing) {
      updateObjective(modal.strategyId, modal.editing.id, { name, description, perspective })
    } else {
      addObjective(modal.strategyId, { name, description, perspective })
    }
  }

  const handleAddLink = () => {
    if (linkSource && linkTarget) {
      addCausalLink(activeStrategyTab, linkSource, linkTarget)
      setLinkSource(''); setLinkTarget('')
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    const errs = await mapStore.complete(b3Selected)
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      return
    }
    setErrors([])
    toast.success('Hoàn thành B4! Chuyển sang B5.')
    navigate('/fishbone')
  }

  const totalObjs = b3Selected.reduce((s, id) => s + (strategyObjectives[id]?.length ?? 0), 0)

  const TABS = [
    { key: 'map', label: 'Tạo mục tiêu' },
    { key: 'links', label: 'Liên kết nhân quả' },
    ...(b3Selected.length === 2 ? [{ key: 'merge', label: 'Gộp bản đồ tổng' }] : []),
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B4. Bản đồ Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo mục tiêu chiến lược cho {b3Selected.length === 1 ? '1 chiến lược' : '2 chiến lược'} đã chọn ở B3 — đủ 4 góc độ BSC, tối đa 12 mục tiêu/chiến lược
          </p>
        </div>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
        >
          {completing ? 'Đang lưu...' : 'Hoàn thành B4'} <ChevronRight size={16} />
        </button>
      </div>

      {/* Strategy tab (when 2 strategies) */}
      {b3Selected.length > 1 && viewMode !== 'merge' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 shrink-0">Chiến lược:</span>
          {selectedStrategies.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStrategyTab(s.id)}
              className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                activeStrategyTab === s.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              <span className={clsx('w-1.5 h-1.5 rounded-full', activeStrategyTab === s.id ? 'bg-white' : 'bg-blue-400')} />
              {s.name}
              <span className="opacity-70 text-[10px]">({strategyObjectives[s.id]?.length ?? 0}/12)</span>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setViewMode(key)}
              className={clsx('px-5 py-3.5 text-sm font-semibold transition-colors border-b-2',
                viewMode === key ? 'border-blue-500 text-blue-600 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              )}
            >
              {label}
            </button>
          ))}
          <div className="ml-auto flex items-center pr-4">
            <span className="text-xs text-slate-400">Tổng: <strong className="text-slate-700">{totalObjs}</strong> mục tiêu</span>
          </div>
        </div>

        <div className="p-5">
          {viewMode === 'map' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {PERSPECTIVES.map((p) => (
                <PerspectiveLane
                  key={p.key}
                  perspective={p}
                  objectives={activeStratObjs.filter((o) => o.perspective === p.key)}
                  onAdd={handleAddObjective}
                  onEdit={handleEditObjective}
                  onRemove={(id) => removeObjective(activeStrategyTab, id)}
                />
              ))}
            </div>
          )}

          {viewMode === 'links' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-3">Thêm đường liên kết nhân quả</p>
                <p className="text-[11px] text-slate-400 mb-3">Gợi ý hướng: Học hỏi → Quy trình → Khách hàng → Tài chính</p>
                <div className="flex gap-2 items-center flex-wrap">
                  <select value={linkSource} onChange={(e) => setLinkSource(e.target.value)} className="flex-1 min-w-40 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white">
                    <option value="">Mục tiêu nguồn (nguyên nhân)...</option>
                    {activeStratObjs.map((o) => <option key={o.id} value={o.id}>{P_MAP[o.perspective]?.label} — {o.name}</option>)}
                  </select>
                  <ArrowRight size={18} className="text-slate-300 shrink-0" />
                  <select value={linkTarget} onChange={(e) => setLinkTarget(e.target.value)} className="flex-1 min-w-40 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none bg-white">
                    <option value="">Mục tiêu đích (kết quả)...</option>
                    {activeStratObjs.filter((o) => o.id !== linkSource).map((o) => <option key={o.id} value={o.id}>{P_MAP[o.perspective]?.label} — {o.name}</option>)}
                  </select>
                  <button onClick={handleAddLink} disabled={!linkSource || !linkTarget} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 rounded-xl">
                    Thêm liên kết
                  </button>
                </div>
              </div>

              {activeStratLinks.length === 0 ? (
                <p className="text-sm text-slate-300 italic text-center py-8">Chưa có liên kết nào</p>
              ) : (
                <div className="space-y-2">
                  {activeStratLinks.map((l) => {
                    const src = activeStratObjs.find((o) => o.id === l.sourceId)
                    const tgt = activeStratObjs.find((o) => o.id === l.targetId)
                    if (!src || !tgt) return null
                    const ps = P_MAP[src.perspective]
                    const pt = P_MAP[tgt.perspective]
                    return (
                      <div key={l.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0', ps?.badge)}>{ps?.label}</span>
                          <span className="text-xs text-slate-700 truncate">{src.name}</span>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 shrink-0" />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0', pt?.badge)}>{pt?.label}</span>
                          <span className="text-xs text-slate-700 truncate">{tgt.name}</span>
                        </div>
                        <button onClick={() => removeCausalLink(activeStrategyTab, l.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 shrink-0">
                          <X size={12} className="text-red-400" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {viewMode === 'merge' && b3Selected.length === 2 && (
            <MergeStep
              strategyIds={b3Selected}
              strategies={selectedStrategies}
              strategyObjectives={strategyObjectives}
              mapStore={mapStore}
            />
          )}
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
          <p className="text-xs font-bold text-red-700 uppercase mb-2 flex items-center gap-2"><AlertCircle size={14} /> Cần bổ sung trước khi hoàn thành B4</p>
          {errors.map((e, i) => <p key={i} className="text-xs text-red-600">• {e}</p>)}
        </div>
      )}

      {/* Progress overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PERSPECTIVES.map((p) => {
          const count = b3Selected.reduce((s, sid) => s + (strategyObjectives[sid] ?? []).filter((o) => o.perspective === p.key).length, 0)
          return (
            <div key={p.key} className={clsx('bg-white rounded-xl border-2 p-4', count > 0 ? p.border : 'border-slate-100')}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold" style={{ color: count > 0 ? p.color : '#94a3b8' }}>{p.label}</p>
                {count > 0 && <Check size={14} className="text-emerald-500" />}
              </div>
              <p className="text-2xl font-bold" style={{ color: count > 0 ? p.color : '#cbd5e1' }}>{count}</p>
              <p className="text-[10px] text-slate-400">mục tiêu{count === 0 ? ' — cần ít nhất 1' : ''}</p>
            </div>
          )
        })}
      </div>

      <ObjectiveModal
        open={modal.open}
        onClose={() => setModal({ open: false, strategyId: null, perspective: null, editing: null })}
        onSave={handleSaveObjective}
        initial={modal.editing}
        perspective={modal.perspective}
      />
    </div>
  )
}

