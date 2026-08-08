import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Edit3, Save, X, ChevronRight, CheckSquare, Square } from 'lucide-react'
import { useSWOTStore } from '../../store/swotStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

// ── Meta ─────────────────────────────────────────────────────────────────────

const SEVEN_S_META = {
  STRATEGY:     { label: 'Strategy',     vi: 'Chiến lược',        color: 'blue' },
  STRUCTURE:    { label: 'Structure',    vi: 'Cơ cấu tổ chức',    color: 'purple' },
  SYSTEMS:      { label: 'Systems',      vi: 'Hệ thống / Quy trình', color: 'emerald' },
  SHARED_VALUES:{ label: 'Shared Values',vi: 'Giá trị chung',     color: 'amber' },
  SKILLS:       { label: 'Skills',       vi: 'Kỹ năng / Năng lực', color: 'rose' },
  STYLE:        { label: 'Style',        vi: 'Phong cách quản lý', color: 'cyan' },
  STAFF:        { label: 'Staff',        vi: 'Nhân sự',           color: 'orange' },
}

const FIVE_FORCES_META = {
  COMPETITIVE_RIVALRY:    { label: 'Competitive Rivalry',    vi: 'Mức độ cạnh tranh trong ngành',     color: 'red' },
  SUPPLIER_POWER:         { label: 'Supplier Power',         vi: 'Quyền lực nhà cung cấp',            color: 'orange' },
  BUYER_POWER:            { label: 'Buyer Power',            vi: 'Quyền lực khách hàng',              color: 'amber' },
  THREAT_OF_SUBSTITUTES:  { label: 'Threat of Substitutes',  vi: 'Nguy cơ từ sản phẩm thay thế',      color: 'purple' },
  THREAT_OF_NEW_ENTRANTS: { label: 'Threat of New Entrants', vi: 'Nguy cơ từ đối thủ mới gia nhập',   color: 'pink' },
}

const PESTEL_META = {
  POLITICAL:     { label: 'Political',     vi: 'Chính trị',   color: 'blue' },
  ECONOMIC:      { label: 'Economic',      vi: 'Kinh tế',     color: 'emerald' },
  SOCIAL:        { label: 'Social',        vi: 'Xã hội',      color: 'purple' },
  TECHNOLOGICAL: { label: 'Technological', vi: 'Công nghệ',   color: 'cyan' },
  ENVIRONMENTAL: { label: 'Environmental', vi: 'Môi trường',  color: 'green' },
  LEGAL:         { label: 'Legal',         vi: 'Pháp lý',     color: 'orange' },
}

const COLOR_RING = {
  blue:   'border-blue-200 bg-blue-50 text-blue-700',
  purple: 'border-purple-200 bg-purple-50 text-purple-700',
  emerald:'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber:  'border-amber-200 bg-amber-50 text-amber-700',
  rose:   'border-rose-200 bg-rose-50 text-rose-700',
  cyan:   'border-cyan-200 bg-cyan-50 text-cyan-700',
  orange: 'border-orange-200 bg-orange-50 text-orange-700',
  red:    'border-red-200 bg-red-50 text-red-700',
  pink:   'border-pink-200 bg-pink-50 text-pink-700',
  green:  'border-green-200 bg-green-50 text-green-700',
}

const SWOT_META = {
  S: { label: 'S — Điểm mạnh',   labelShort: 'S',  desc: 'Chọn từ 7S',              bg: 'bg-emerald-50', border: 'border-emerald-300', badge: 'bg-emerald-600 text-white', dot: 'bg-emerald-500' },
  W: { label: 'W — Điểm yếu',    labelShort: 'W',  desc: 'Chọn từ 7S',              bg: 'bg-red-50',     border: 'border-red-300',     badge: 'bg-red-600 text-white',     dot: 'bg-red-500' },
  O: { label: 'O — Cơ hội',      labelShort: 'O',  desc: 'Chọn từ 5 Forces + PESTEL', bg: 'bg-blue-50',  border: 'border-blue-300',    badge: 'bg-blue-600 text-white',    dot: 'bg-blue-500' },
  T: { label: 'T — Thách thức',  labelShort: 'T',  desc: 'Chọn từ 5 Forces + PESTEL', bg: 'bg-amber-50', border: 'border-amber-300',   badge: 'bg-amber-600 text-white',   dot: 'bg-amber-500' },
}

// ── Reusable: DynamicTextList ─────────────────────────────────────────────────

function DynamicTextList({ items, onAdd, onUpdate, onRemove, placeholder }) {
  const [addText, setAddText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAdd = () => {
    const v = addText.trim()
    if (!v) return
    onAdd(v)
    setAddText('')
  }

  const handleSave = () => {
    const v = editText.trim()
    if (!v) return
    onUpdate(editingId, v)
    setEditingId(null)
  }

  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2 group min-h-8">
          {editingId === item.id ? (
            <>
              <input value={editText} onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditingId(null) }}
                className="flex-1 text-sm border border-blue-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-100" autoFocus />
              <button onClick={handleSave} className="text-emerald-600 hover:text-emerald-700 shrink-0"><Save size={13} /></button>
              <button onClick={() => setEditingId(null)} className="text-slate-400 shrink-0"><X size={13} /></button>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="flex-1 text-sm text-slate-700">{item.value}</span>
              <button onClick={() => { setEditingId(item.id); setEditText(item.value) }}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity shrink-0"><Edit3 size={12} /></button>
              <button onClick={() => onRemove(item.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity shrink-0"><Trash2 size={12} /></button>
            </>
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <input value={addText} onChange={(e) => setAddText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder || 'Thêm mục mới...'}
          className="flex-1 text-sm border border-dashed border-slate-300 rounded-lg px-2 py-1.5 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-slate-50" />
        <button onClick={handleAdd} disabled={!addText.trim()}
          className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg transition-colors shrink-0">
          <Plus size={11} /> Thêm
        </button>
      </div>
    </div>
  )
}

// ── Tab: Source model (7S / 5 Forces / PESTEL) ───────────────────────────────

function SourceModelTab({ model, metaMap, storeKey }) {
  const store = useSWOTStore()
  const data = store[storeKey]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.entries(metaMap).map(([factor, meta]) => {
        const ring = COLOR_RING[meta.color] || COLOR_RING.blue
        const items = data[factor] || []
        return (
          <div key={factor} className={`rounded-xl border p-4 ${ring}`}>
            <div className="mb-3">
              <p className="text-xs font-bold uppercase tracking-wide">{meta.label}</p>
              <p className="text-[11px] opacity-70">{meta.vi}</p>
            </div>
            <DynamicTextList
              items={items}
              onAdd={(v) => store.addSourceItem(storeKey, factor, v)}
              onUpdate={(id, v) => store.updateSourceItem(storeKey, factor, id, v)}
              onRemove={(id) => store.removeSourceItem(storeKey, factor, id)}
            />
          </div>
        )
      })}
    </div>
  )
}

// ── Tab: SWOT picker ──────────────────────────────────────────────────────────

function SwotTab() {
  const store = useSWOTStore()
  const { swotS, swotW, swotO, swotT, toggleSwotItem } = store

  const allSevenS = store.getAllSevenSItems()
  const allExternal = store.getAllExternalItems()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* S — pick from 7S */}
      <SwotPickerPanel
        quadrant="S" meta={SWOT_META.S}
        selected={swotS} opposite={swotW}
        items={allSevenS}
        factorMeta={SEVEN_S_META}
        onToggle={(id) => toggleSwotItem('S', id)}
      />
      {/* W — pick from 7S */}
      <SwotPickerPanel
        quadrant="W" meta={SWOT_META.W}
        selected={swotW} opposite={swotS}
        items={allSevenS}
        factorMeta={SEVEN_S_META}
        onToggle={(id) => toggleSwotItem('W', id)}
      />
      {/* O — pick from 5 Forces + PESTEL */}
      <SwotPickerPanel
        quadrant="O" meta={SWOT_META.O}
        selected={swotO} opposite={swotT}
        items={allExternal}
        factorMeta={{ ...FIVE_FORCES_META, ...PESTEL_META }}
        onToggle={(id) => toggleSwotItem('O', id)}
      />
      {/* T — pick from 5 Forces + PESTEL */}
      <SwotPickerPanel
        quadrant="T" meta={SWOT_META.T}
        selected={swotT} opposite={swotO}
        items={allExternal}
        factorMeta={{ ...FIVE_FORCES_META, ...PESTEL_META }}
        onToggle={(id) => toggleSwotItem('T', id)}
      />
    </div>
  )
}

function SwotPickerPanel({ quadrant, meta, selected, opposite, items, factorMeta, onToggle }) {
  return (
    <div className={`rounded-xl border ${meta.border} overflow-hidden`}>
      <div className={`px-4 py-3 flex items-center gap-2 ${meta.bg}`}>
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${meta.badge}`}>{quadrant}</span>
        <div>
          <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
          <p className="text-[11px] text-slate-500">{meta.desc}</p>
        </div>
        <span className="ml-auto text-xs font-semibold text-slate-600">{selected.length} đã chọn</span>
      </div>

      {/* Selected items */}
      {selected.length > 0 && (
        <div className={`px-4 py-2 ${meta.bg} border-b ${meta.border}`}>
          <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Đã chọn</p>
          <div className="space-y-1">
            {selected.map((id) => {
              const item = items.find((i) => i.id === id)
              if (!item) return null
              return (
                <div key={id} className="flex items-center gap-2 group">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${meta.dot}`} />
                  <span className="flex-1 text-xs text-slate-700">{item.value}</span>
                  <button onClick={() => onToggle(id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"><X size={11} /></button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Picker list */}
      <div className="px-4 py-3 max-h-64 overflow-y-auto space-y-1 bg-white">
        <p className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Chọn từ nguồn</p>
        {items.map((item) => {
          const isSelected = selected.includes(item.id)
          const isUsedOpposite = opposite.includes(item.id)
          const fm = factorMeta[item.factor]
          return (
            <label
              key={item.id}
              className={`flex items-start gap-2 p-1.5 rounded-lg cursor-pointer transition-colors group ${
                isUsedOpposite ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
              }`}
            >
              <button
                disabled={isUsedOpposite}
                onClick={() => !isUsedOpposite && onToggle(item.id)}
                className="mt-0.5 shrink-0"
              >
                {isSelected
                  ? <CheckSquare size={14} className="text-blue-600" />
                  : <Square size={14} className="text-slate-300" />
                }
              </button>
              <div className="flex-1 min-w-0">
                {fm && (
                  <span className="text-[10px] text-slate-400 font-medium">{fm.vi} · </span>
                )}
                <span className="text-xs text-slate-700">{item.value}</span>
              </div>
            </label>
          )
        })}
        {items.length === 0 && (
          <p className="text-xs text-slate-400 italic py-4 text-center">Chưa có dữ liệu nguồn — hãy nhập ở tab trước</p>
        )}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const TABS = [
  { id: '7s',        label: 'B2.1 Mô hình 7S' },
  { id: 'fiveforces',label: 'B2.2 Mô hình 5 Áp lực' },
  { id: 'pestel',    label: 'B2.3 PESTEL' },
  { id: 'swot',      label: 'B2.4 Phân tích SWOT' },
]

export default function SwotPage() {
  const [activeTab, setActiveTab] = useState('7s')
  const navigate = useNavigate()
  const store = useSWOTStore()
  const { strategyId } = useBscContextStore()

  useEffect(() => {
    if (strategyId) store.fetch(strategyId)
  }, [strategyId])

  const counts = {
    '7s':         Object.values(store.sevenS).reduce((s, a) => s + a.length, 0),
    fiveforces:   Object.values(store.fiveForces).reduce((s, a) => s + a.length, 0),
    pestel:       Object.values(store.pestel).reduce((s, a) => s + a.length, 0),
    swot:         store.swotS.length + store.swotW.length + store.swotO.length + store.swotT.length,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">B2. Xây dựng Chiến lược</h1>
          <p className="text-sm text-slate-500 mt-1">Phân tích 7S, 5 Áp lực, PESTEL → SWOT → Chiến lược SO/ST/WO/WT</p>
        </div>
        <button
          onClick={() => navigate('/strategy-build/formulate')}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm shrink-0"
        >
          Tiếp theo: Xây dựng Chiến lược
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 px-4 py-3.5 text-xs font-semibold transition-colors whitespace-nowrap border-b-2 ${
                activeTab === tab.id
                  ? 'text-blue-700 border-blue-500 bg-blue-50/50'
                  : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
              }`}>{counts[tab.id]} mục</span>
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === '7s' && (
            <SourceModelTab model="sevenS" metaMap={SEVEN_S_META} storeKey="sevenS" />
          )}
          {activeTab === 'fiveforces' && (
            <SourceModelTab model="fiveForces" metaMap={FIVE_FORCES_META} storeKey="fiveForces" />
          )}
          {activeTab === 'pestel' && (
            <SourceModelTab model="pestel" metaMap={PESTEL_META} storeKey="pestel" />
          )}
          {activeTab === 'swot' && <SwotTab />}
        </div>
      </div>
    </div>
  )
}
