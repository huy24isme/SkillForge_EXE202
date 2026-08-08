import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight, Plus, Trash2, Edit3, Save, X, AlertCircle,
  BarChart2, PieChart as PieIcon, Layers, Star, Zap, Shield, Target, TrendingUp,
  Loader2, Check, CheckCircle2, Users
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import clsx from 'clsx'
import { useAssessmentStore } from '../../store/assessmentStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'
import { toast } from '../../components/ui/toast.jsx'

const PIE_COLORS = ['#3C50E0', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#A855F7']

// ────────────────────────────────────────────────────────────
// Reusable section card (Premium Glassmorphism)
// ────────────────────────────────────────────────────────────
function SectionCard({ icon: Icon, iconColor = 'text-[#3C50E0]', iconBg = 'bg-blue-50', title, subtitle, children, className }) {
  return (
    <div className={clsx(
      "bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
      className
    )}>
      <div className="flex items-center gap-4 px-7 py-6 border-b border-slate-50/80">
        <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm", iconBg, iconColor)}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">{title}</h2>
          {subtitle && <p className="text-[13px] text-slate-500 mt-1 font-medium">{subtitle}</p>}
        </div>
      </div>
      <div className="p-7 bg-slate-50/20">{children}</div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Dynamic text list (Premium Pill/Card style)
// ────────────────────────────────────────────────────────────
function DynamicTextList({ items, onAdd, onUpdate, onRemove, placeholder = 'Thêm mục mới...', emptyText = 'Chưa có dữ liệu' }) {
  const [addText, setAddText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  const handleAdd = () => {
    const trimmed = addText.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setAddText('')
  }

  const handleStartEdit = (item) => {
    setEditingId(item.id)
    setEditText(item.value)
  }

  const handleSaveEdit = () => {
    const trimmed = editText.trim()
    if (!trimmed) return
    onUpdate(editingId, trimmed)
    setEditingId(null)
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="py-4 text-center border-2 border-dashed border-slate-200 rounded-2xl">
          <p className="text-sm text-slate-400 font-medium">{emptyText}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {items.map((item) => (
            <div key={item.id} className="group relative flex items-center">
              {editingId === item.id ? (
                <div className="flex items-center bg-white border-2 border-[#3C50E0] rounded-xl overflow-hidden shadow-sm shadow-blue-100">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit()
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    className="text-sm px-4 py-2 w-48 outline-none text-slate-700 font-medium"
                    autoFocus
                  />
                  <div className="flex items-center px-1 bg-slate-50 h-full border-l border-slate-100">
                    <button onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Check size={14} strokeWidth={3} /></button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors"><X size={14} strokeWidth={3} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2 hover:border-[#3C50E0]/40 transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3C50E0] shrink-0 mr-3" />
                  <span className="text-sm font-medium text-slate-700">{item.value}</span>
                  
                  {/* Hover actions */}
                  <div className="flex items-center gap-1 ml-3 pl-3 border-l border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleStartEdit(item)} className="text-slate-400 hover:text-[#3C50E0] transition-colors"><Edit3 size={14} /></button>
                    <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add input */}
      <div className="relative group max-w-sm mt-2">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Plus size={16} className="text-slate-400 group-focus-within:text-[#3C50E0] transition-colors" />
        </div>
        <input
          value={addText}
          onChange={(e) => setAddText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder={placeholder}
          className="w-full text-sm bg-white border border-slate-200 rounded-xl pl-11 pr-20 py-3 outline-none focus:border-[#3C50E0] focus:ring-4 focus:ring-[#3C50E0]/10 transition-all text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal shadow-sm"
        />
        <div className="absolute inset-y-0 right-1 flex items-center">
          <button
            onClick={handleAdd}
            disabled={!addText.trim()}
            className="px-4 py-1.5 text-xs font-bold bg-[#3C50E0] text-white rounded-lg hover:bg-[#3142C4] disabled:opacity-0 disabled:scale-95 transition-all shadow-sm"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 4.1 Financial section
// ────────────────────────────────────────────────────────────
function FinancialSection() {
  const { financial, addFinancialYear, updateFinancialYear, removeFinancialYear } = useAssessmentStore()
  const currentYear = new Date().getFullYear()
  const [newRow, setNewRow] = useState({ year: currentYear + 1, revenue: '', profit: '' })

  const handleAddYear = () => {
    const y = Number(newRow.year)
    const r = Number(newRow.revenue)
    const p = Number(newRow.profit)
    if (!y || newRow.revenue === '') return
    if (financial.some((f) => f.year === y)) return
    addFinancialYear(y, r, p)
    setNewRow({ year: y + 1, revenue: '', profit: '' })
  }

  const chartData = [...financial]
    .sort((a, b) => a.year - b.year)
    .map((r) => ({ year: String(r.year), revenue: r.revenue, profit: r.profit }))

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-[#1C2434] text-white rounded-xl px-4 py-3 text-sm shadow-xl border border-slate-700">
        <p className="font-bold mb-2 text-slate-200 border-b border-slate-700 pb-2">Năm {label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-[#3C50E0]" /> Doanh thu</span>
            <span className="font-bold text-white">{Number(payload[0]?.value).toLocaleString()} tỷ</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Lợi nhuận</span>
            <span className="font-bold text-white">{Number(payload[1]?.value).toLocaleString()} tỷ</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SectionCard icon={BarChart2} title="4.1 Nền tảng Tài chính" subtitle="Dữ liệu tài chính cốt lõi trong tối đa 3 năm (Đơn vị: Tỷ đồng)">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Table/Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Năm</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh thu</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lợi nhuận</th>
                  <th className="px-3 py-3 w-12" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {financial.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-slate-400 font-medium text-xs">Chưa có dữ liệu tài chính</td>
                  </tr>
                )}
                {financial.map((row) => (
                  <FinancialRow key={row.id} row={row} onUpdate={updateFinancialYear} onRemove={removeFinancialYear} />
                ))}
              </tbody>
            </table>
          </div>

          {financial.length < 3 ? (
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:border-[#3C50E0] focus-within:ring-4 focus-within:ring-[#3C50E0]/10 transition-all">
              <input
                type="number"
                value={newRow.year}
                onChange={(e) => setNewRow({ ...newRow, year: e.target.value })}
                className="w-20 text-sm font-bold text-slate-700 bg-slate-50 rounded-xl px-3 py-2 text-center outline-none border border-transparent focus:border-blue-300 focus:bg-white transition-all"
                placeholder="Năm"
              />
              <div className="flex-1 relative">
                <input
                  type="number" min="0" value={newRow.revenue}
                  onChange={(e) => setNewRow({ ...newRow, revenue: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-slate-50 rounded-xl pl-3 pr-8 py-2 text-right outline-none border border-transparent focus:border-blue-300 focus:bg-white transition-all"
                  placeholder="Doanh thu"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">tỷ</span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="number" value={newRow.profit}
                  onChange={(e) => setNewRow({ ...newRow, profit: e.target.value })}
                  className="w-full text-sm font-semibold text-slate-700 bg-slate-50 rounded-xl pl-3 pr-8 py-2 text-right outline-none border border-transparent focus:border-blue-300 focus:bg-white transition-all"
                  placeholder="Lợi nhuận"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">tỷ</span>
              </div>
              <button
                onClick={handleAddYear}
                disabled={!newRow.revenue && newRow.revenue !== 0}
                className="w-10 h-10 flex items-center justify-center bg-[#3C50E0] hover:bg-[#3142C4] disabled:bg-slate-200 text-white rounded-xl transition-colors shrink-0 shadow-sm"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-center">
              <p className="text-sm font-semibold text-emerald-700 flex items-center justify-center gap-2">
                <CheckCircle2 size={16} /> Đã cập nhật đủ 3 năm tài chính
              </p>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-end gap-6 text-sm font-semibold text-slate-600 mb-6">
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-[#3C50E0]" /> Doanh thu</span>
            <span className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /> Lợi nhuận</span>
          </div>
          <div className="h-64">
            {chartData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                <BarChart2 size={48} className="text-slate-300 mb-4" />
                <p className="text-sm font-medium text-slate-500">Nhập dữ liệu để xem biểu đồ</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={8} barSize={32} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#3C50E0" />
                  <Bar dataKey="profit" radius={[6, 6, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function FinancialRow({ row, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ revenue: row.revenue, profit: row.profit })

  const handleSave = () => {
    onUpdate(row.id, { revenue: Number(draft.revenue), profit: Number(draft.profit) })
    setEditing(false)
  }

  if (editing) {
    return (
      <tr className="bg-blue-50/30">
        <td className="px-5 py-3 font-bold text-slate-800">{row.year}</td>
        <td className="px-5 py-3">
          <input
            type="number" min="0" value={draft.revenue}
            onChange={(e) => setDraft({ ...draft, revenue: e.target.value })}
            className="w-full text-right border-2 border-blue-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-900 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </td>
        <td className="px-5 py-3">
          <input
            type="number" value={draft.profit}
            onChange={(e) => setDraft({ ...draft, profit: e.target.value })}
            className="w-full text-right border-2 border-blue-300 rounded-lg px-3 py-1.5 text-sm font-semibold text-blue-900 outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          />
        </td>
        <td className="px-3 py-3">
          <div className="flex gap-2 justify-end">
            <button onClick={handleSave} className="w-7 h-7 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center hover:bg-emerald-200 transition-colors"><Check size={14} strokeWidth={3} /></button>
            <button onClick={() => setEditing(false)} className="w-7 h-7 rounded bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"><X size={14} strokeWidth={3} /></button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="px-5 py-3.5 font-bold text-slate-700">{row.year}</td>
      <td className="px-5 py-3.5 text-right font-medium text-slate-600">{row.revenue.toLocaleString()}</td>
      <td className="px-5 py-3.5 text-right font-medium text-slate-600">{row.profit.toLocaleString()}</td>
      <td className="px-3 py-3.5">
        <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="p-1.5 text-slate-400 hover:text-[#3C50E0] hover:bg-blue-50 rounded-lg transition-colors"><Edit3 size={15} /></button>
          <button onClick={() => onRemove(row.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
        </div>
      </td>
    </tr>
  )
}

// ────────────────────────────────────────────────────────────
// 4.2 Market Share section
// ────────────────────────────────────────────────────────────
function MarketShareSection() {
  const { marketShareCurrent, marketShareFuture, addMarketShareEntry, updateMarketShareEntry, removeMarketShareEntry } = useAssessmentStore()

  const totalCurrent = marketShareCurrent.reduce((s, r) => s + (Number(r.percentage) || 0), 0)
  const totalFuture = marketShareFuture.reduce((s, r) => s + (Number(r.percentage) || 0), 0)

  return (
    <SectionCard icon={PieIcon} iconBg="bg-indigo-50" iconColor="text-indigo-600" title="4.2 Phân tích Thị phần" subtitle="Biểu đồ tròn thể hiện cơ cấu thị phần (Yêu cầu tổng 100%)">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12 relative">
        <MarketSharePanel
          label="Thị phần Hiện tại"
          type="current"
          entries={marketShareCurrent}
          total={totalCurrent}
          onAdd={addMarketShareEntry}
          onUpdate={updateMarketShareEntry}
          onRemove={removeMarketShareEntry}
        />
        <div className="hidden xl:block w-px bg-slate-200 absolute left-1/2 top-4 bottom-4 -translate-x-1/2" />
        <MarketSharePanel
          label="Mục tiêu Tương lai"
          type="future"
          entries={marketShareFuture}
          total={totalFuture}
          onAdd={addMarketShareEntry}
          onUpdate={updateMarketShareEntry}
          onRemove={removeMarketShareEntry}
        />
      </div>
    </SectionCard>
  )
}

function MarketSharePanel({ label, type, entries, total, onAdd, onUpdate, onRemove }) {
  const isValid = Math.abs(total - 100) < 0.01

  const pieData = entries
    .filter((e) => e.name && Number(e.percentage) > 0)
    .map((e) => ({ name: e.name, value: Number(e.percentage) }))

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[15px] font-bold text-slate-800">{label}</h3>
        <div className={clsx(
          "flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-colors",
          isValid ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-600"
        )}>
          {isValid ? <Check size={14} strokeWidth={3} /> : <AlertCircle size={14} strokeWidth={2.5} />}
          <span className="text-xs font-bold tracking-wide">TỔNG: {total}%</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6">
        {/* Pie chart */}
        <div className="w-48 h-48 shrink-0 relative">
          {pieData.length === 0 ? (
            <div className="absolute inset-0 border-4 border-dashed border-slate-200 rounded-full flex items-center justify-center">
              <PieIcon size={24} className="text-slate-300" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" cy="50%" 
                  innerRadius={50} outerRadius={80} 
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(v) => [`${v}%`, 'Thị phần']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Inner label */}
          {pieData.length > 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-800">{total}%</span>
            </div>
          )}
        </div>

        {/* Legend / Compact Table */}
        <div className="flex-1 w-full bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Doanh nghiệp</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20">%</th>
                <th className="text-center px-2 py-2.5 text-[10px] font-bold text-[#3C50E0] uppercase tracking-wider w-16" title="Đánh dấu là doanh nghiệp của bạn">Của mình</th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map((entry, i) => (
                <MarketShareRow
                  key={entry.id}
                  entry={entry}
                  color={PIE_COLORS[i % PIE_COLORS.length]}
                  type={type}
                  onUpdate={onUpdate}
                  onRemove={onRemove}
                />
              ))}
              <tr>
                <td colSpan={4} className="p-2 bg-slate-50/50">
                  <button
                    onClick={() => onAdd(type, { name: '', percentage: 0, isOwn: false })}
                    className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#3C50E0] hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200"
                  >
                    <Plus size={14} strokeWidth={2.5} /> Thêm công ty
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MarketShareRow({ entry, color, type, onUpdate, onRemove }) {
  return (
    <tr className="group hover:bg-slate-50/50 transition-colors">
      <td className="px-4 py-2">
        <div className="flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: color }} />
          <input
            value={entry.name}
            onChange={(e) => onUpdate(type, entry.id, { name: e.target.value })}
            className="w-full bg-transparent outline-none text-slate-700 text-sm font-semibold placeholder:text-slate-300 placeholder:font-normal border-b border-transparent hover:border-slate-300 focus:border-[#3C50E0] py-1 transition-colors"
            placeholder="Tên công ty..."
          />
        </div>
      </td>
      <td className="px-4 py-2">
        <div className="flex items-center justify-end group/input">
          <input
            type="number" min="0" max="100" value={entry.percentage || ''}
            onChange={(e) => onUpdate(type, entry.id, { percentage: Number(e.target.value) })}
            className="w-12 text-right bg-transparent outline-none text-slate-700 text-sm font-bold border-b border-transparent hover:border-slate-300 focus:border-[#3C50E0] py-1 transition-colors"
            placeholder="0"
          />
        </div>
      </td>
      <td className="px-2 py-2 text-center">
        <label className="inline-flex items-center justify-center cursor-pointer p-1 rounded-full hover:bg-blue-50 transition-colors">
          <input
            type="checkbox"
            checked={entry.isOwn}
            onChange={(e) => onUpdate(type, entry.id, { isOwn: e.target.checked })}
            className="w-4 h-4 rounded-full border-2 border-slate-300 text-[#3C50E0] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#3C50E0]"
          />
        </label>
      </td>
      <td className="pr-3 py-2 text-right">
        <button
          onClick={() => onRemove(type, entry.id)}
          className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  )
}

// ────────────────────────────────────────────────────────────
// 4.3 Segments & Products section
// ────────────────────────────────────────────────────────────
function SegmentsSection() {
  const store = useAssessmentStore()

  const lists = [
    { field: 'currentSegments', label: 'Phân khúc Khách hàng Hiện tại', placeholder: 'VD: Khách hàng cá nhân, Doanh nghiệp SMEs...', icon: Users },
    { field: 'futureSegments', label: 'Mục tiêu Phân khúc Tương lai', placeholder: 'VD: Doanh nghiệp FDI...', icon: Target },
    { field: 'currentProducts', label: 'Sản phẩm/Dịch vụ Chủ lực Hiện tại', placeholder: 'VD: Phần mềm BSC...', icon: Layers },
    { field: 'futureProducts', label: 'Sản phẩm/Dịch vụ Tương lai', placeholder: 'VD: AI Analytics...', icon: Zap },
  ]

  // We don't have Users icon imported from lucide-react in this file except in another component.
  // Oh wait, I didn't import Users from lucide-react. I should use Star, etc. or import Users.
  // I will just remove the icons from SegmentsSection or use layers.

  return (
    <SectionCard icon={Layers} iconBg="bg-violet-50" iconColor="text-violet-600" title="4.3 Phân khúc & Sản phẩm" subtitle="Xác định tệp khách hàng và các giải pháp giá trị cốt lõi">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {lists.map(({ field, label, placeholder }) => (
          <div key={field} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
              </div>
              <p className="text-sm font-bold text-slate-700 tracking-wide">{label}</p>
            </div>
            <DynamicTextList
              items={store[field]}
              onAdd={(v) => store.addListItem(field, v)}
              onUpdate={(id, v) => store.updateListItem(field, id, v)}
              onRemove={(id) => store.removeListItem(field, id)}
              placeholder={placeholder}
            />
          </div>
        ))}
      </div>
    </SectionCard>
  )
}

// ────────────────────────────────────────────────────────────
// 4.4–4.8 Single-list sections
// ────────────────────────────────────────────────────────────
function SimpleListSection({ icon, iconBg, iconColor, title, subtitle, field, placeholder }) {
  const store = useAssessmentStore()
  return (
    <SectionCard icon={icon} iconBg={iconBg} iconColor={iconColor} title={title} subtitle={subtitle}>
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-4xl">
        <DynamicTextList
          items={store[field]}
          onAdd={(v) => store.addListItem(field, v)}
          onUpdate={(id, v) => store.updateListItem(field, id, v)}
          onRemove={(id) => store.removeListItem(field, id)}
          placeholder={placeholder}
        />
      </div>
    </SectionCard>
  )
}

// ────────────────────────────────────────────────────────────
// Main page
// ────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const { complete, fetch, loading } = useAssessmentStore()
  const { strategyId, loading: ctxLoading, error: ctxError, init } = useBscContextStore()
  const navigate = useNavigate()
  const [errors, setErrors] = useState([])
  const [completing, setCompleting] = useState(false)

  // If strategyId is missing on mount, try to init
  useEffect(() => {
    if (!strategyId && !ctxLoading) {
      init()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId, ctxLoading])

  useEffect(() => {
    if (strategyId) fetch(strategyId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  const handleComplete = async () => {
    setCompleting(true)
    const errs = await complete()
    setCompleting(false)
    if (errs.length > 0) {
      setErrors(errs)
      toast.error(errs[0])
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setErrors([])
    toast.success('Hoàn thành B1! Chuyển sang B2.')
    navigate('/strategy-build/swot')
  }

  if (ctxLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#3C50E0] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 font-medium text-sm animate-pulse">Đang chuẩn bị dữ liệu...</p>
      </div>
    )
  }

  if (!strategyId && ctxError) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl border border-red-100 shadow-2xl shadow-red-500/10 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={40} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Lỗi khởi tạo Chiến lược</h2>
        <p className="text-slate-500 text-sm mb-8">{ctxError}</p>
        <button
          onClick={() => init()}
          className="w-full py-3.5 bg-[#3C50E0] hover:bg-[#3142C4] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-95"
        >
          Thử lại ngay
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20">
      
      {/* ── Premium Header ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1C2434] via-[#2A3547] to-[#1C2434] rounded-[32px] p-8 sm:p-10 shadow-xl border border-slate-700">
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-blue-500/30">
                Bước 1 / 8
              </span>
              <span className="text-slate-400 text-sm font-medium">Khởi tạo BSC</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              Đánh giá Hiện trạng Doanh nghiệp
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Bước quan trọng đầu tiên trong quy trình xây dựng Balanced Scorecard. 
              Vui lòng nhập liệu trung thực và chi tiết để làm nền tảng cho các phân tích chiến lược ở bước sau.
            </p>
          </div>

          <button
            onClick={handleComplete}
            disabled={completing}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3C50E0] hover:bg-blue-500 disabled:opacity-70 text-white font-bold rounded-2xl transition-all shadow-[0_0_40px_rgba(60,80,224,0.4)] hover:shadow-[0_0_60px_rgba(60,80,224,0.6)] hover:-translate-y-1 shrink-0"
          >
            {completing ? (
              <><Loader2 size={20} className="animate-spin" /> Đang xử lý...</>
            ) : (
              <>Hoàn thành Bước 1 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>

      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="bg-red-50/80 backdrop-blur-xl border border-red-200 rounded-[24px] p-6 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <span className="text-lg font-bold text-red-800">Cần bổ sung thông tin trước khi tiếp tục</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-14">
            {errors.map((err, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-red-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className="space-y-8">
        {/* 4.1 Tài chính */}
        <FinancialSection />

        {/* 4.2 Thị phần */}
        <MarketShareSection />

        {/* 4.3 Phân khúc & Sản phẩm */}
        <SegmentsSection />

        {/* Cạnh tranh (2 cột) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleListSection
            icon={Star} iconBg="bg-amber-50" iconColor="text-amber-500"
            title="4.4 Điểm mạnh cốt lõi"
            subtitle="Lợi thế nội bộ độc quyền của doanh nghiệp"
            field="companyStrengths"
            placeholder="Thêm điểm mạnh..."
          />
          <SimpleListSection
            icon={Zap} iconBg="bg-purple-50" iconColor="text-purple-600"
            title="4.5 Yếu tố then chốt ngành"
            subtitle="Các KSF (Key Success Factors) trong ngành"
            field="industrySuccessFactors"
            placeholder="Thêm yếu tố thành công..."
          />
        </div>

        {/* Đối thủ (2 cột) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SimpleListSection
            icon={Shield} iconBg="bg-red-50" iconColor="text-red-500"
            title="4.6 Sức mạnh đối thủ"
            subtitle="Ưu thế vượt trội của các đối thủ trực tiếp"
            field="competitorStrengths"
            placeholder="Thêm điểm mạnh của đối thủ..."
          />
          <SimpleListSection
            icon={Target} iconBg="bg-emerald-50" iconColor="text-emerald-500"
            title="4.7 Điểm yếu đối thủ"
            subtitle="Lỗ hổng của đối thủ để khai thác"
            field="competitorWeaknesses"
            placeholder="Thêm điểm yếu của đối thủ..."
          />
        </div>

        {/* 4.8 Lợi thế cạnh tranh */}
        <SimpleListSection
          icon={TrendingUp} iconBg="bg-blue-50" iconColor="text-[#3C50E0]"
          title="4.8 Vị thế cạnh tranh"
          subtitle="Tổng kết lợi thế cạnh tranh kỳ vọng trên thị trường"
          field="competitiveAdvantages"
          placeholder="Thêm lợi thế cạnh tranh..."
        />
      </div>

      {/* ── Footer CTA ── */}
      <div className="pt-8 border-t border-slate-200 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold text-slate-500 text-center sm:text-left">
          Mọi thay đổi đã được tự động lưu. Hãy chắc chắn dữ liệu chính xác trước khi sang B2.
        </span>
        <button
          onClick={handleComplete}
          disabled={completing}
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#3C50E0] hover:bg-[#3142C4] disabled:bg-blue-400 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
        >
          {completing ? 'Đang lưu...' : 'Tiếp tục: B2. Xây dựng chiến lược'}
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  )
}
