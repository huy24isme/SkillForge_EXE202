import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, ChevronRight, X, AlertCircle, CheckSquare, Square } from 'lucide-react'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { toast } from '../../components/ui/toast.jsx'

const TYPE_META = {
  SO: { label: 'SO — Tấn công',       desc: 'Điểm mạnh × Cơ hội',     badge: 'bg-emerald-600 text-white', bg: 'bg-emerald-50',  border: 'border-emerald-200' },
  ST: { label: 'ST — Phòng thủ',      desc: 'Điểm mạnh × Thách thức', badge: 'bg-blue-600 text-white',    bg: 'bg-blue-50',     border: 'border-blue-200' },
  WO: { label: 'WO — Củng cố',        desc: 'Điểm yếu × Cơ hội',      badge: 'bg-purple-600 text-white',  bg: 'bg-purple-50',   border: 'border-purple-200' },
  WT: { label: 'WT — Hạn chế rủi ro', desc: 'Điểm yếu × Thách thức',  badge: 'bg-amber-600 text-white',   bg: 'bg-amber-50',    border: 'border-amber-200' },
}

const SWOT_BADGE = {
  S: 'bg-emerald-100 text-emerald-700',
  W: 'bg-red-100 text-red-700',
  O: 'bg-blue-100 text-blue-700',
  T: 'bg-amber-100 text-amber-700',
}

const TYPES = ['SO', 'ST', 'WO', 'WT']
const MAX_STRATEGIES = 12

// ── Strategy form modal ───────────────────────────────────────────────────────

function StrategyModal({ open, onClose, onSave, editStrategy }) {
  const store = useSWOTStore()
  const allSevenS = store.getAllSevenSItems()
  const allExternal = store.getAllExternalItems()
  const usedIds = store.getUsedSwotItemIds()

  const [type, setType] = useState(editStrategy?.type ?? 'SO')
  const [name, setName] = useState(editStrategy?.name ?? '')
  const [description, setDescription] = useState(editStrategy?.description ?? '')
  const [sItems, setSItems] = useState(editStrategy?.sItems ? [...editStrategy.sItems] : [])
  const [wItems, setWItems] = useState(editStrategy?.wItems ? [...editStrategy.wItems] : [])
  const [oItem, setOItem] = useState(editStrategy?.oItem ?? null)
  const [tItem, setTItem] = useState(editStrategy?.tItem ?? null)

  if (!open) return null

  // IDs excluded from selection because used in OTHER strategies
  const editId = editStrategy?.id
  const excludedIds = new Set(
    [...usedIds].filter((id) => {
      if (!editStrategy) return true
      return !editStrategy.sItems.includes(id) &&
             !editStrategy.wItems.includes(id) &&
             id !== editStrategy.oItem &&
             id !== editStrategy.tItem
    })
  )

  const swotSItems = allSevenS.filter((i) => store.swotS.includes(i.id))
  const swotWItems = allSevenS.filter((i) => store.swotW.includes(i.id))
  const swotOItems = allExternal.filter((i) => store.swotO.includes(i.id))
  const swotTItems = allExternal.filter((i) => store.swotT.includes(i.id))

  const needsS = type === 'SO' || type === 'ST'
  const needsW = type === 'WO' || type === 'WT'
  const needsO = type === 'SO' || type === 'WO'
  const needsT = type === 'ST' || type === 'WT'

  const handleTypeChange = (t) => {
    setType(t)
    setSItems([])
    setWItems([])
    setOItem(null)
    setTItem(null)
  }

  const toggleMulti = (setter, current, id) => {
    setter(current.includes(id) ? current.filter((x) => x !== id) : [...current, id])
  }

  const validate = () => {
    if (!name.trim()) return 'Tên chiến lược không được rỗng'
    if (needsS && sItems.length === 0) return 'Cần chọn ít nhất 1 Điểm mạnh (S)'
    if (needsW && wItems.length === 0) return 'Cần chọn ít nhất 1 Điểm yếu (W)'
    if (needsO && !oItem) return 'Cần chọn đúng 1 Cơ hội (O)'
    if (needsT && !tItem) return 'Cần chọn đúng 1 Thách thức (T)'
    return null
  }

  const handleSave = () => {
    const err = validate()
    if (err) { toast.error(err); return }
    onSave({ type, name: name.trim(), description: description.trim(), sItems, wItems, oItem, tItem })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between shrink-0 ${TYPE_META[type]?.bg} border-b ${TYPE_META[type]?.border}`}>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{editStrategy ? 'Chỉnh sửa chiến lược' : 'Tạo chiến lược mới'}</h3>
            <p className="text-[11px] text-slate-500">{TYPE_META[type]?.desc}</p>
          </div>
          <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-slate-800" /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="label-xs">Nhóm chiến lược</label>
            <div className="flex gap-2 flex-wrap">
              {TYPES.map((t) => (
                <button key={t} onClick={() => handleTypeChange(t)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    type === t ? TYPE_META[t].badge : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}>{t}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="label-xs">Tên chiến lược <span className="text-red-500">*</span></label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Tăng trưởng thị phần SME bằng năng lực triển khai nhanh"
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          {/* Description */}
          <div>
            <label className="label-xs">Mô tả chiến lược</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={2} placeholder="Mô tả ngắn gọn định hướng triển khai..."
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
          </div>

          {/* S picker */}
          {needsS && (
            <SwotItemPicker
              label="Điểm mạnh (S)" quadrant="S"
              items={swotSItems} selected={sItems}
              excludedIds={excludedIds} multi
              onToggle={(id) => toggleMulti(setSItems, sItems, id)}
            />
          )}

          {/* W picker */}
          {needsW && (
            <SwotItemPicker
              label="Điểm yếu (W)" quadrant="W"
              items={swotWItems} selected={wItems}
              excludedIds={excludedIds} multi
              onToggle={(id) => toggleMulti(setWItems, wItems, id)}
            />
          )}

          {/* O picker */}
          {needsO && (
            <SwotItemPicker
              label="Cơ hội (O) — chọn đúng 1" quadrant="O"
              items={swotOItems} selected={oItem ? [oItem] : []}
              excludedIds={excludedIds} multi={false}
              onToggle={(id) => setOItem(oItem === id ? null : id)}
            />
          )}

          {/* T picker */}
          {needsT && (
            <SwotItemPicker
              label="Thách thức (T) — chọn đúng 1" quadrant="T"
              items={swotTItems} selected={tItem ? [tItem] : []}
              excludedIds={excludedIds} multi={false}
              onToggle={(id) => setTItem(tItem === id ? null : id)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-4 border-t border-slate-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Hủy</button>
          <button onClick={handleSave} className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors">
            {editStrategy ? 'Cập nhật' : 'Tạo chiến lược'}
          </button>
        </div>
      </div>

      <style>{`
        .label-xs { display:block; font-size:11px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.04em; margin-bottom:6px; }
      `}</style>
    </div>
  )
}

function SwotItemPicker({ label, quadrant, items, selected, excludedIds, multi, onToggle }) {
  const badge = SWOT_BADGE[quadrant]
  return (
    <div>
      <label className="label-xs flex items-center gap-1.5">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${badge}`}>{quadrant}</span>
        {label}
      </label>
      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic">Chưa có item — hãy chọn ở tab SWOT trước</p>
      ) : (
        <div className="space-y-1 max-h-36 overflow-y-auto border border-slate-100 rounded-xl p-2">
          {items.map((item) => {
            const isSelected = selected.includes(item.id)
            const isExcluded = excludedIds.has(item.id)
            return (
              <label key={item.id}
                className={`flex items-start gap-2 p-1.5 rounded-lg cursor-pointer transition-colors ${
                  isExcluded ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
                }`}>
                <button disabled={isExcluded} onClick={() => !isExcluded && onToggle(item.id)} className="mt-0.5 shrink-0">
                  {isSelected
                    ? <CheckSquare size={14} className="text-blue-600" />
                    : <Square size={14} className="text-slate-300" />
                  }
                </button>
                <span className="text-xs text-slate-700">{item.value}</span>
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Strategy card ─────────────────────────────────────────────────────────────

function StrategyCard({ strategy, allItems, onEdit, onDelete }) {
  const meta = TYPE_META[strategy.type]
  const getItem = (id) => allItems.find((i) => i.id === id)

  const usedSW = [...(strategy.sItems || []), ...(strategy.wItems || [])].map(getItem).filter(Boolean)
  const usedOT = [strategy.oItem, strategy.tItem].filter(Boolean).map(getItem).filter(Boolean)

  return (
    <div className={`rounded-xl border ${meta.border} ${meta.bg} p-4 group`}>
      <div className="flex items-start gap-3">
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0 ${meta.badge}`}>{strategy.type}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 leading-snug">{strategy.name}</p>
          {strategy.description && (
            <p className="text-xs text-slate-500 mt-1 leading-snug">{strategy.description}</p>
          )}
          {/* SWOT items used */}
          <div className="flex flex-wrap gap-1 mt-2">
            {usedSW.map((item) => (
              <span key={item.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                strategy.sItems?.includes(item.id) ? SWOT_BADGE.S : SWOT_BADGE.W
              }`}>{item.value.substring(0, 28)}{item.value.length > 28 ? '…' : ''}</span>
            ))}
            {usedOT.map((item) => (
              <span key={item.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                strategy.oItem === item.id ? SWOT_BADGE.O : SWOT_BADGE.T
              }`}>{item.value.substring(0, 28)}{item.value.length > 28 ? '…' : ''}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={() => onEdit(strategy)}
            className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-colors">
            <Edit3 size={11} className="text-slate-500" />
          </button>
          <button onClick={() => onDelete(strategy.id)}
            className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-300 transition-colors">
            <Trash2 size={11} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function FormulationPage() {
  const store = useSWOTStore()
  const { strategies, addStrategy, updateStrategy, deleteStrategy, completeB2 } = store
  const navigate = useNavigate()
  const { strategyId } = useBscContextStore()

  useEffect(() => {
    if (strategyId) store.fetch(strategyId)
  }, [strategyId])

  const [activeTab, setActiveTab] = useState('SO')
  const [modal, setModal] = useState({ open: false, editStrategy: null })
  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)

  const allItems = [...store.getAllSevenSItems(), ...store.getAllExternalItems()]

  const openAdd = () => setModal({ open: true, editStrategy: null })
  const openEdit = (s) => setModal({ open: true, editStrategy: s })
  const closeModal = () => setModal({ open: false, editStrategy: null })

  const handleSave = async (data) => {
    if (modal.editStrategy) {
      await updateStrategy(modal.editStrategy.id, data)
    } else {
      await addStrategy(data)
    }
  }

  const handleComplete = async () => {
    setCompleting(true)
    const errs = await completeB2()
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    toast.success('Hoàn thành B2! Chuyển sang B3.')
    navigate('/strategy-results/selection')
  }

  const byType = (type) => strategies.filter((s) => s.type === type)
  const canAdd = strategies.length < MAX_STRATEGIES

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B2.5 Xây dựng Chiến lược SO/ST/WO/WT</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo chiến lược từ SWOT · {strategies.length}/{MAX_STRATEGIES} chiến lược
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          {canAdd && (
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors">
              <Plus size={15} /> Thêm chiến lược
            </button>
          )}
          <button onClick={handleComplete} disabled={completing}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
            {completing ? 'Đang lưu...' : 'Hoàn thành B2'} <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <span className="text-sm font-semibold text-red-700">Cần hoàn thiện trước khi kết thúc B2</span>
          </div>
          {errors.map((err, i) => <p key={i} className="text-sm text-red-600 pl-5">• {err}</p>)}
        </div>
      )}

      {/* Tabs + cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100">
          {TYPES.map((type) => {
            const meta = TYPE_META[type]
            const count = byType(type).length
            return (
              <button key={type} onClick={() => setActiveTab(type)}
                className={`flex-1 flex flex-col items-center gap-1 px-4 py-3.5 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === type
                    ? 'text-slate-800 border-blue-500 bg-blue-50/30'
                    : 'text-slate-400 border-transparent hover:bg-slate-50'
                }`}>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${meta.badge}`}>{type}</span>
                <span className="text-slate-500 text-[11px]">{meta.desc}</span>
                <span className="text-[10px] text-slate-400">{count} chiến lược</span>
              </button>
            )
          })}
        </div>

        <div className="p-5">
          {/* Info bar */}
          <div className={`rounded-xl p-3 mb-4 border ${TYPE_META[activeTab].border} ${TYPE_META[activeTab].bg}`}>
            <p className="text-xs font-semibold text-slate-700">{TYPE_META[activeTab].label}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{TYPE_META[activeTab].desc}</p>
          </div>

          <div className="space-y-3">
            {byType(activeTab).map((s) => (
              <StrategyCard key={s.id} strategy={s} allItems={allItems} onEdit={openEdit} onDelete={deleteStrategy} />
            ))}
            {byType(activeTab).length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <p className="text-sm">Chưa có chiến lược {activeTab}</p>
                {canAdd && (
                  <button onClick={openAdd} className="mt-2 text-xs text-blue-500 hover:underline">+ Tạo chiến lược {activeTab}</button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold text-blue-600">{strategies.length}</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Chiến lược đã tạo</p>
            <p className="text-xs text-slate-400">Tối đa {MAX_STRATEGIES} · Sẽ đưa sang B3 để lựa chọn</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPES.map((t) => {
            const cnt = byType(t).length
            return cnt > 0 ? (
              <span key={t} className={`text-xs font-bold px-2 py-1 rounded-lg ${TYPE_META[t].badge}`}>{t}: {cnt}</span>
            ) : null
          })}
        </div>
        <button onClick={handleComplete}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors">
          Hoàn thành B2 <ChevronRight size={15} />
        </button>
      </div>

      <StrategyModal
        open={modal.open}
        onClose={closeModal}
        onSave={handleSave}
        editStrategy={modal.editStrategy}
      />
    </div>
  )
}

