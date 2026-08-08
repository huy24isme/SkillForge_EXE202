import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, CheckSquare, Square, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react'
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

const SOURCE_LABEL = {
  STRATEGY: 'Chiến lược', STRUCTURE: 'Cơ cấu', SYSTEMS: 'Hệ thống',
  SHARED_VALUES: 'Giá trị chung', SKILLS: 'Kỹ năng', STYLE: 'Phong cách', STAFF: 'Nhân sự',
  COMPETITIVE_RIVALRY: 'Cạnh tranh', SUPPLIER_POWER: 'Nhà cung cấp',
  BUYER_POWER: 'Khách hàng', THREAT_OF_SUBSTITUTES: 'Sản phẩm thay thế',
  THREAT_OF_NEW_ENTRANTS: 'Đối thủ mới',
  POLITICAL: 'Chính trị', ECONOMIC: 'Kinh tế', SOCIAL: 'Xã hội',
  TECHNOLOGICAL: 'Công nghệ', ENVIRONMENTAL: 'Môi trường', LEGAL: 'Pháp lý',
}

const MAX_SELECT = 2

// ── Strategy card ─────────────────────────────────────────────────────────────

function StrategyCard({ strategy, isSelected, isDisabled, note, onToggle, onNoteChange, allItems }) {
  const [expanded, setExpanded] = useState(false)
  const meta = TYPE_META[strategy.type]

  const getItem = (id) => allItems.find((i) => i.id === id)

  const swotChips = [
    ...(strategy.sItems || []).map((id) => ({ id, quadrant: 'S', item: getItem(id) })),
    ...(strategy.wItems || []).map((id) => ({ id, quadrant: 'W', item: getItem(id) })),
    ...(strategy.oItem ? [{ id: strategy.oItem, quadrant: 'O', item: getItem(strategy.oItem) }] : []),
    ...(strategy.tItem ? [{ id: strategy.tItem, quadrant: 'T', item: getItem(strategy.tItem) }] : []),
  ]

  return (
    <div className={`rounded-xl border transition-all ${
      isSelected
        ? `${meta.border} ring-2 ring-blue-400/40 shadow-md`
        : isDisabled
        ? 'border-slate-200 opacity-50'
        : `border-slate-200 hover:border-slate-300 hover:shadow-sm`
    } bg-white`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={() => !isDisabled && onToggle(strategy.id)}
            disabled={isDisabled}
            className="mt-0.5 shrink-0"
          >
            {isSelected
              ? <CheckSquare size={18} className="text-blue-600" />
              : <Square size={18} className={isDisabled ? 'text-slate-200' : 'text-slate-300 hover:text-slate-500'} />
            }
          </button>

          <div className="flex-1 min-w-0">
            {/* Type + name */}
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${meta.badge}`}>{strategy.type}</span>
              <span className="text-xs text-slate-400">{meta.desc}</span>
            </div>
            <p className="text-sm font-semibold text-slate-800 leading-snug">{strategy.name}</p>
            {strategy.description && (
              <p className="text-xs text-slate-500 mt-1 leading-snug">{strategy.description}</p>
            )}

            {/* SWOT chips summary */}
            <div className="flex flex-wrap gap-1 mt-2">
              {swotChips.map(({ id, quadrant, item }) => item && (
                <span key={id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${SWOT_BADGE[quadrant]}`}>
                  {quadrant}: {item.value.substring(0, 30)}{item.value.length > 30 ? '…' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="shrink-0 w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            {expanded ? <ChevronUp size={13} className="text-slate-400" /> : <ChevronDown size={13} className="text-slate-400" />}
          </button>
        </div>

        {/* Expanded SWOT detail */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100 ml-7 space-y-2">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Nguồn gốc SWOT</p>
            {swotChips.map(({ id, quadrant, item }) => item && (
              <div key={id} className="flex items-start gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${SWOT_BADGE[quadrant]}`}>{quadrant}</span>
                <div>
                  <span className="text-xs text-slate-700">{item.value}</span>
                  {item.factor && (
                    <span className="text-[10px] text-slate-400 ml-1.5">
                      · {item.source === 'pestel' ? 'PESTEL' : item.source === 'fiveForces' ? '5 Áp lực' : '7S'}
                      {' / '}{SOURCE_LABEL[item.factor] || item.factor}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note input when selected */}
        {isSelected && (
          <div className="mt-3 ml-7">
            <label className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              Ghi chú lý do lựa chọn (không bắt buộc)
            </label>
            <textarea
              value={note || ''}
              onChange={(e) => onNoteChange(strategy.id, e.target.value)}
              rows={2}
              placeholder="VD: Chiến lược này phù hợp với năng lực hiện tại và tận dụng nhu cầu chuyển đổi số đang tăng..."
              className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none bg-slate-50"
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TYPES = ['SO', 'ST', 'WO', 'WT']

export default function SelectionPage() {
  const store = useSWOTStore()
  const { strategies, b3Selected, b3Notes, toggleB3Strategy, setB3Note, completeB3 } = store
  const navigate = useNavigate()
  const { strategyId } = useBscContextStore()

  useEffect(() => {
    if (strategyId) store.fetch(strategyId)
  }, [strategyId])

  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  const allItems = [...store.getAllSevenSItems(), ...store.getAllExternalItems()]

  const displayStrategies = activeTab === 'all'
    ? strategies
    : strategies.filter((s) => s.type === activeTab)

  const handleComplete = async () => {
    setCompleting(true)
    const errs = await completeB3()
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    toast.success('Hoàn thành B3! Chuyển sang B4.')
    navigate('/strategy-map/perspectives')
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B3. Kết quả Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">
            Chọn <strong>1–2 chiến lược chính thức</strong> từ danh sách ứng viên để triển khai sang B4
          </p>
        </div>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
        >
          {completing ? 'Đang lưu...' : 'Hoàn thành B3'} <ChevronRight size={16} />
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-red-600 shrink-0" />
            <span className="text-sm font-semibold text-red-700">Cần kiểm tra lại</span>
          </div>
          {errors.map((e, i) => <p key={i} className="text-sm text-red-600 pl-5">• {e}</p>)}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left: strategy list */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                  activeTab === 'all' ? 'text-blue-700 border-blue-500 bg-blue-50/40' : 'text-slate-500 border-transparent hover:bg-slate-50'
                }`}
              >
                Tất cả ({strategies.length})
              </button>
              {TYPES.map((t) => {
                const cnt = strategies.filter((s) => s.type === t).length
                if (cnt === 0) return null
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-3 text-xs font-semibold transition-colors border-b-2 ${
                      activeTab === t ? 'text-blue-700 border-blue-500 bg-blue-50/40' : 'text-slate-500 border-transparent hover:bg-slate-50'
                    }`}
                  >
                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${TYPE_META[t].badge} mr-1`}>{t}</span>
                    {cnt}
                  </button>
                )
              })}
            </div>
            <div className="p-4 space-y-3">
              {displayStrategies.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">Chưa có chiến lược — hãy tạo ở B2.5</p>
              )}
              {displayStrategies.map((s) => (
                <StrategyCard
                  key={s.id}
                  strategy={s}
                  isSelected={b3Selected.includes(s.id)}
                  isDisabled={b3Selected.length >= MAX_SELECT && !b3Selected.includes(s.id)}
                  note={b3Notes[s.id]}
                  onToggle={toggleB3Strategy}
                  onNoteChange={setB3Note}
                  allItems={allItems}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: selected summary */}
        <div className="space-y-4">
          {/* Selection counter */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Chiến lược đã chọn</p>
            <div className="flex items-center gap-3 mb-4">
              <div className={`text-4xl font-bold ${b3Selected.length > 0 ? 'text-blue-600' : 'text-slate-300'}`}>
                {b3Selected.length}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700">/ {MAX_SELECT} tối đa</p>
                <p className="text-xs text-slate-400">Tối thiểu 1 chiến lược</p>
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mb-4">
              {[0, 1].map((i) => (
                <div key={i} className={`flex-1 h-2 rounded-full transition-colors ${
                  i < b3Selected.length ? 'bg-blue-500' : 'bg-slate-100'
                }`} />
              ))}
            </div>

            {b3Selected.length === 0 && (
              <p className="text-xs text-slate-400 italic">Chưa chọn chiến lược nào — click vào checkbox để chọn</p>
            )}
            {b3Selected.length >= MAX_SELECT && (
              <p className="text-xs text-amber-600 font-medium">Đã đạt giới hạn tối đa. Bỏ chọn để thay đổi.</p>
            )}
          </div>

          {/* Selected strategy cards */}
          {b3Selected.map((id, idx) => {
            const s = strategies.find((x) => x.id === id)
            if (!s) return (
              <div key={id} className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-xs text-red-600 font-medium">⚠ Chiến lược không còn tồn tại</p>
                <p className="text-[11px] text-red-400 mt-0.5">ID: {id} — vui lòng bỏ chọn</p>
              </div>
            )
            const meta = TYPE_META[s.type]
            return (
              <div key={id} className={`bg-white rounded-2xl border ${meta.border} shadow-sm p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${meta.badge}`}>{s.type}</span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${meta.bg} text-slate-600`}>Ưu tiên {idx + 1}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 leading-snug">{s.name}</p>
                {b3Notes[id] && (
                  <p className="text-[11px] text-slate-500 mt-2 italic leading-snug border-t border-slate-100 pt-2">
                    "{b3Notes[id]}"
                  </p>
                )}
              </div>
            )
          })}

          {/* Rule reminder */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-600">Quy tắc B3</p>
            <p>• Chọn tối thiểu 1, tối đa 2 chiến lược</p>
            <p>• Không tạo chiến lược mới ở đây — quay lại B2.5 nếu cần</p>
            <p>• Chiến lược được chọn sẽ đưa sang B4 để xây bản đồ chiến lược</p>
            {b3Selected.length === 2 && (
              <p className="text-blue-600 font-medium mt-1">2 chiến lược: B4 sẽ xây bản đồ riêng rồi gộp lại.</p>
            )}
          </div>

          {/* Complete button */}
          <button
            onClick={handleComplete}
            disabled={completing}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
          >
            {completing ? 'Đang lưu...' : 'Hoàn thành B3'} <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

