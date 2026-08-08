import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

const TYPE_META = {
  SO: { label: 'SO — Tấn công',       badge: 'bg-emerald-600 text-white', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  ST: { label: 'ST — Phòng thủ',      badge: 'bg-blue-600 text-white',    bg: 'bg-blue-50',    border: 'border-blue-200' },
  WO: { label: 'WO — Củng cố',        badge: 'bg-purple-600 text-white',  bg: 'bg-purple-50',  border: 'border-purple-200' },
  WT: { label: 'WT — Hạn chế rủi ro', badge: 'bg-amber-600 text-white',   bg: 'bg-amber-50',   border: 'border-amber-200' },
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

export default function OutcomesPage() {
  const store = useSWOTStore()
  const { strategies, b3Selected, b3Notes } = store
  const navigate = useNavigate()
  const { strategyId } = useBscContextStore()

  useEffect(() => {
    if (strategyId) store.fetch(strategyId)
  }, [strategyId])

  const allItems = [...store.getAllSevenSItems(), ...store.getAllExternalItems()]
  const getItem = (id) => allItems.find((i) => i.id === id)

  const selected = b3Selected
    .map((id, idx) => ({ strategy: strategies.find((s) => s.id === id), note: b3Notes[id], order: idx + 1 }))
    .filter((x) => x.strategy)

  if (selected.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-400 text-sm mb-4">Chưa có chiến lược nào được chọn ở B3</p>
        <button onClick={() => navigate('/strategy-results/selection')}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl">
          Quay lại chọn chiến lược
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B3. Tóm tắt Chiến lược đã chọn</h1>
          <p className="text-sm text-slate-500 mt-1">
            {selected.length} chiến lược chính thức — đầu vào cho B4 Bản đồ Chiến lược
          </p>
        </div>
        <button onClick={() => navigate('/strategy-map/perspectives')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0">
          Tiếp theo: Bản đồ Chiến lược <ChevronRight size={16} />
        </button>
      </div>

      <button onClick={() => navigate('/strategy-results/selection')}
        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft size={13} /> Quay lại chọn chiến lược
      </button>

      {selected.map(({ strategy: s, note, order }) => {
        const meta = TYPE_META[s.type]
        const swotRows = [
          ...(s.sItems || []).map((id) => ({ id, q: 'S', item: getItem(id) })),
          ...(s.wItems || []).map((id) => ({ id, q: 'W', item: getItem(id) })),
          ...(s.oItem ? [{ id: s.oItem, q: 'O', item: getItem(s.oItem) }] : []),
          ...(s.tItem ? [{ id: s.tItem, q: 'T', item: getItem(s.tItem) }] : []),
        ]

        return (
          <div key={s.id} className={`bg-white rounded-2xl border ${meta.border} shadow-sm overflow-hidden`}>
            {/* Card header */}
            <div className={`px-5 py-4 ${meta.bg} border-b ${meta.border} flex items-center gap-3`}>
              <span className="text-sm font-bold text-slate-400">#{order}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${meta.badge}`}>{s.type}</span>
              <h2 className="font-bold text-slate-800 text-sm flex-1">{s.name}</h2>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${meta.bg} text-slate-600 border ${meta.border}`}>
                Ưu tiên {order}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Description */}
              {s.description && (
                <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
              )}

              {/* SWOT items detail */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Nguồn gốc SWOT</p>
                <div className="space-y-1.5">
                  {swotRows.map(({ id, q, item }) => item && (
                    <div key={id} className="flex items-start gap-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${SWOT_BADGE[q]}`}>{q}</span>
                      <div className="min-w-0">
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
              </div>

              {/* Note */}
              {note && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 px-4 py-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Ghi chú lý do lựa chọn</p>
                  <p className="text-xs text-slate-600 italic leading-relaxed">"{note}"</p>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Next step */}
      <div className="flex justify-end">
        <button onClick={() => navigate('/strategy-map/perspectives')}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-sm">
          Tiếp theo: B4 Bản đồ Chiến lược <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
