import { useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2, Circle, Loader2, ChevronRight,
  Target, Flag, AlertTriangle, TrendingUp, Users,
  ArrowUpRight, ArrowDownRight, Activity,
  Layers, ListTodo, Trophy
} from 'lucide-react'
import clsx from 'clsx'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { useBSCWorkflowStore } from '../../store/bscWorkflowStore.js'
import { useSWOTStore } from '../../store/swotStore.js'
import { useStrategyMapStore } from '../../store/strategyMapStore.js'
import { useFishboneStore } from '../../store/fishboneStore.js'
import { useWeightStore } from '../../store/weightStore.js'
import { useActionPlanStore, STATUS_META } from '../../store/actionPlanStore.js'
import { useKPIMeasureStore } from '../../store/kpiMeasureStore.js'
import { useBscContextStore } from '../../store/bscContextStore.js'

const PERSPECTIVES = [
  { id: 'FINANCIAL',           label: 'Tài chính',            color: '#16a34a', light: '#dcfce7', icon: '💰' },
  { id: 'CUSTOMER',            label: 'Khách hàng',           color: '#3C50E0', light: '#e0e7ff', icon: '👥' },
  { id: 'INTERNAL_PROCESS',    label: 'Quy trình nội bộ',     color: '#9333ea', light: '#f3e8ff', icon: '⚙️' },
  { id: 'LEARNING_AND_GROWTH', label: 'Học hỏi & Phát triển', color: '#d97706', light: '#fef3c7', icon: '🌱' },
]

const STEPS = [
  { id: 'B1', label: 'Đánh giá',    to: '/assessment' },
  { id: 'B2', label: 'Chiến lược',  to: '/strategy-build/swot' },
  { id: 'B3', label: 'Kết quả',     to: '/strategy-results/selection' },
  { id: 'B4', label: 'Bản đồ',      to: '/strategy-map/perspectives' },
  { id: 'B5', label: 'Xương cá',    to: '/fishbone' },
  { id: 'B6', label: 'Tỉ trọng',    to: '/weight-allocation' },
  { id: 'B7', label: 'Đo lường',    to: '/kpi-setup' },
  { id: 'B8', label: 'Thực thi',    to: '/action-plan' },
]

const TASK_STATUS_ORDER = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'BLOCKED', 'CANCELLED']

// ── Stat Card (Premium) ───────────────────────────────────────────────
function StatCard({ label, value, sub, color, icon: Icon, trend, trendUp, to, navigate, highlight }) {
  return (
    <div
      className={clsx(
        'group relative bg-white rounded-[24px] p-6 flex flex-col transition-all duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 overflow-hidden',
        to && 'cursor-pointer hover:-translate-y-1',
        highlight && 'ring-2 ring-[#3C50E0]/20'
      )}
      onClick={to ? () => navigate(to) : undefined}
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-5 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: color }} />
      <div className="relative z-10 flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-[0_4px_10px_rgb(0,0,0,0.05)] bg-white border border-slate-50" style={{ color }}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
        {to && (
          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 group-hover:bg-blue-50 group-hover:text-[#3C50E0] transition-colors">
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
        )}
      </div>
      <div className="relative z-10 mt-auto">
        <h3 className="text-[32px] font-black text-slate-800 leading-none mb-2 tracking-tight">{value}</h3>
        <p className="text-[14px] text-slate-500 font-bold mb-3">{label}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {trend !== undefined && (
            <span className={clsx(
              'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md uppercase tracking-wider',
              trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            )}>
              {trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
              {trend}
            </span>
          )}
          {sub && <span className="text-[12px] text-slate-400 font-medium">{sub}</span>}
        </div>
      </div>
    </div>
  )
}

// ── BSC Workflow Timeline (Premium Stepper) ──────────────────────────────────
function WorkflowTimeline({ steps, stepStatuses, navigate }) {
  const completed = Object.values(stepStatuses).filter((s) => s?.status === 'completed').length
  const progressPct = Math.round((completed / steps.length) * 100)

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
        <Layers size={200} />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Tiến trình Xây dựng BSC</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Bạn đã hoàn thành {completed} trên {steps.length} bước cốt lõi</p>
        </div>
        <div className="text-left md:text-right">
          <span className="text-3xl font-black text-[#3C50E0]">{progressPct}%</span>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Hoàn thiện</p>
        </div>
      </div>

      <div className="relative z-10">
        {/* Progress bar background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-[3%] right-[3%] h-2 bg-slate-100 rounded-full" />
        {/* Progress bar active */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 left-[3%] h-2 bg-gradient-to-r from-blue-400 to-[#3C50E0] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(60,80,224,0.4)]"
          style={{ width: `${(completed / steps.length) * 94}%` }} 
        />

        <div className="relative flex justify-between">
          {steps.map((step) => {
            const status = stepStatuses[step.id]?.status ?? 'pending'
            return (
              <button
                key={step.id}
                onClick={() => navigate(step.to)}
                className="group flex flex-col items-center gap-3 outline-none w-16"
              >
                <div className={clsx(
                  'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-white z-10 shadow-sm',
                  status === 'completed' ? 'bg-[#3C50E0] text-white hover:bg-blue-600 hover:scale-110' :
                  status === 'active'    ? 'bg-white text-[#3C50E0] border-2 border-[#3C50E0] shadow-[0_0_15px_rgba(60,80,224,0.3)] hover:scale-110' :
                  'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:scale-105 border border-slate-200'
                )}>
                  {status === 'completed' ? (
                    <CheckCircle2 size={20} strokeWidth={2.5} />
                  ) : status === 'active' ? (
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#3C50E0]"></span>
                    </span>
                  ) : (
                    <span className="text-[14px] font-bold">{step.id.replace('B', '')}</span>
                  )}
                </div>
                <div className="text-center w-max absolute top-14 mt-1">
                  <span className={clsx(
                    'block text-[11px] font-black uppercase tracking-wider transition-colors',
                    status === 'completed' ? 'text-[#3C50E0]' :
                    status === 'active'    ? 'text-[#3C50E0]' : 'text-slate-400 group-hover:text-slate-600'
                  )}>
                    {step.id}
                  </span>
                  <span className={clsx(
                    'block text-[12px] font-semibold mt-0.5 transition-colors',
                    status === 'completed' ? 'text-slate-700' :
                    status === 'active'    ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-500'
                  )}>
                    {step.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
        <div className="h-14" /> {/* Spacer for absolute labels */}
      </div>
    </div>
  )
}

// ── Perspective Cards (Premium) ───────────────────────────────────────────────
function PerspectiveCard({ p, objectives, kpis, weight, configuredKpis, tasks, actionPlans }) {
  const perspObjs = objectives.filter((o) => o.perspective === p.id)
  const perspKpis = kpis.filter((k) => k.perspective === p.id)
  const perspKpiIds = new Set(perspKpis.map((k) => k.id))
  const perspAPs = actionPlans.filter((ap) => perspKpiIds.has(ap.kpiId))
  const perspAPIds = new Set(perspAPs.map((ap) => ap.id))
  const perspTasks = tasks.filter((t) => perspAPIds.has(t.actionPlanId))
  const doneTasks = perspTasks.filter((t) => t.status === 'DONE').length
  const configuredCount = perspKpis.filter((k) => configuredKpis.has(k.id)).length
  const taskPct = perspTasks.length > 0 ? Math.round((doneTasks / perspTasks.length) * 100) : 0
  const kpiPct = perspKpis.length > 0 ? Math.round((configuredCount / perspKpis.length) * 100) : 0

  return (
    <div className="relative bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all hover:-translate-y-1">
      <div className="absolute top-0 inset-x-0 h-1.5 opacity-80" style={{ background: `linear-gradient(90deg, ${p.color}, ${p.color}40)` }} />
      <div className="p-7">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ background: p.light }}>
              {p.icon}
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-800 tracking-tight">{p.label}</h3>
              <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Khía cạnh BSC</p>
            </div>
          </div>
          {weight > 0 && (
            <div className="flex flex-col items-end">
              <span className="text-[22px] font-black leading-none" style={{ color: p.color }}>{weight}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-1">Tỉ trọng</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: perspObjs.length,  label: 'Mục tiêu' },
            { val: perspKpis.length,  label: 'KPI' },
            { val: perspTasks.length, label: 'Nhiệm vụ' },
          ].map(({ val, label }) => (
            <div key={label} className="text-center py-3 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className="text-[24px] font-black leading-none mb-1 text-slate-800">{val}</div>
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[12px] font-semibold">
              <span className="text-slate-500">Tiến độ thiết lập KPI</span>
              <span style={{ color: p.color }}>{kpiPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${kpiPct}%`, background: p.color }} />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[12px] font-semibold">
              <span className="text-slate-500">Nhiệm vụ hoàn thành</span>
              <span style={{ color: p.color }}>{taskPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${taskPct}%`, background: p.color }} />
            </div>
          </div>
        </div>

        {perspObjs.length === 0 && perspKpis.length === 0 && (
          <div className="absolute inset-x-0 bottom-0 top-24 bg-white/70 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-5 py-2.5 bg-white rounded-full shadow-lg border border-slate-100 text-sm font-bold text-slate-400 flex items-center gap-2">
              <Layers size={16} /> Chưa có dữ liệu
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Blocked Tasks Alert (Premium) ─────────────────────────────────────────────
function BlockedTasksAlert({ tasks, actionPlans, allKpis, navigate }) {
  const blocked = tasks.filter((t) => t.status === 'BLOCKED')
  if (blocked.length === 0) return null
  return (
    <div className="bg-gradient-to-r from-red-50 to-white rounded-[24px] border border-red-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between gap-4 px-8 py-5 border-b border-red-100/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100/80 rounded-2xl flex items-center justify-center shadow-inner">
            <AlertTriangle size={24} strokeWidth={2.5} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-black text-red-800 tracking-tight">{blocked.length} Cảnh báo Tắc nghẽn</h3>
            <p className="text-[13px] text-red-600/80 font-bold mt-0.5 uppercase tracking-wide">Cần xử lý ngay</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/action-plan')}
          className="text-[13px] text-red-700 bg-red-100 hover:bg-red-200 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
        >
          Kiểm tra <ChevronRight size={16} strokeWidth={3} />
        </button>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {blocked.slice(0, 3).map((t) => {
          const ap = actionPlans.find((a) => a.id === t.actionPlanId)
          const kpi = allKpis.find((k) => k.id === ap?.kpiId)
          return (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-red-100 shadow-[0_2px_10px_rgba(239,68,68,0.05)] relative overflow-hidden group hover:border-red-300 transition-colors">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500" />
              <p className="text-[14px] font-bold text-slate-800 leading-tight mb-2 pr-4">{t.name}</p>
              {kpi && <p className="text-[11px] text-slate-500 font-bold mb-3 truncate">KPI: {kpi.name}</p>}
              <div className="bg-red-50 p-3 rounded-xl border border-red-100/50">
                <p className="text-[12px] text-red-700 font-semibold line-clamp-2" title={t.blockReason}>
                  Lý do: {t.blockReason || 'Không rõ'}
                </p>
              </div>
            </div>
          )
        })}
        {blocked.length > 3 && (
          <div className="md:col-span-3 text-center pt-2">
            <p className="text-sm font-bold text-red-500/80 bg-red-50 inline-block px-4 py-1.5 rounded-full">+{blocked.length - 3} công việc khác đang chờ</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Auxiliary Widgets ─────────────────────────────────────────────────────────

function WeightDonut({ perspectiveWeights }) {
  const data = PERSPECTIVES.map((p) => ({
    name: p.label, value: perspectiveWeights[p.id] ?? 0, color: p.color,
  })).filter((d) => d.value > 0)

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
      <div className="mb-6">
        <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Phân bổ Nguồn lực</h2>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-1">Tỉ trọng 4 khía cạnh</p>
      </div>
      {data.length === 0 ? (
        <div className="py-12 flex flex-col items-center opacity-40">
          <PieChart size={40} className="text-slate-300 mb-3" />
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Chưa cấu hình B6</p>
        </div>
      ) : (
        <div className="h-56 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip 
                formatter={(v) => [`${v}%`, 'Tỉ trọng']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', fontWeight: 600, paddingTop: '10px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function TaskStatusChart({ tasks }) {
  const data = TASK_STATUS_ORDER.map((s) => ({
    name: STATUS_META[s].label,
    count: tasks.filter((t) => t.status === s).length,
    color: STATUS_META[s].color,
  })).filter((d) => d.count > 0)

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
      <div className="mb-6">
        <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Trạng thái Công việc</h2>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-1">Báo cáo thực thi</p>
      </div>
      {tasks.length === 0 ? (
        <div className="py-12 flex flex-col items-center opacity-40">
          <ListTodo size={40} className="text-slate-300 mb-3" />
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Chưa có nhiệm vụ</p>
        </div>
      ) : (
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip
                formatter={(v) => [v, 'Tasks']}
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

function DeptParticipation({ departments, objectives, kpis }) {
  const rows = departments.map((dept) => {
    const deptKpis = kpis.filter((k) => k.deptId === dept.id)
    const objIds = new Set(deptKpis.map((k) => k.objectiveId))
    return { dept, kpiCount: deptKpis.length, objCount: objIds.size }
  }).filter((r) => r.kpiCount > 0)

  if (rows.length === 0 || objectives.length === 0) return null

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
      <div className="mb-6">
        <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Mức độ Tham gia</h2>
        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-1">Phân bổ KPI theo phòng ban</p>
      </div>
      <div className="space-y-4">
        {rows.map(({ dept, kpiCount, objCount }) => {
          const maxKpi = Math.max(...rows.map((r) => r.kpiCount), 1)
          const pct = Math.round((kpiCount / maxKpi) * 100)
          return (
            <div key={dept.id}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: dept.color }} />
                <span className="text-[13px] text-slate-700 font-bold flex-1 truncate">{dept.name}</span>
                <span className="text-[11px] text-slate-400 font-medium px-2 py-0.5 bg-slate-50 rounded-md border border-slate-100">{objCount} mục tiêu</span>
                <span className="text-[13px] font-black shrink-0 px-2.5 py-0.5 rounded-md" style={{ color: dept.color, backgroundColor: dept.color + '15' }}>{kpiCount} KPI</span>
              </div>
              <div className="ml-5 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: dept.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function KpiReportsFeed({ kpiReports, allKpis }) {
  const recent = [...kpiReports]
    .sort((a, b) => b.reportedAt.localeCompare(a.reportedAt))
    .slice(0, 8)

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[17px] font-bold text-slate-800 tracking-tight">Dữ liệu Thực tế</h2>
          <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mt-1">Báo cáo KPI gần nhất</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#3C50E0] flex items-center justify-center">
          <Activity size={20} strokeWidth={2.5} />
        </div>
      </div>
      {recent.length === 0 ? (
        <div className="py-12 flex flex-col items-center opacity-40">
          <Activity size={40} className="text-slate-300 mb-3" />
          <p className="text-[13px] font-bold text-slate-500 uppercase tracking-wide">Chưa có báo cáo</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((r) => {
            const kpi = allKpis.find((k) => k.id === r.kpiId)
            return (
              <div key={r.id} className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-white hover:shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-transparent hover:border-slate-200 transition-all">
                <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: kpi?.deptColor ?? '#64748b' }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-slate-700 truncate group-hover:text-[#3C50E0] transition-colors">{kpi?.name ?? r.kpiId}</p>
                  {r.note && <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{r.note}</p>}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[16px] font-black text-slate-800">{r.actualValue}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{r.reportedAt}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()
  const { steps, fetchSteps } = useBSCWorkflowStore()
  const { strategyId } = useBscContextStore()
  const { b3Selected } = useSWOTStore()
  const strategyMapStore = useStrategyMapStore()
  const fishboneStore = useFishboneStore()
  const { perspectiveWeights } = useWeightStore()
  const { actionPlans, tasks, kpiReports } = useActionPlanStore()
  const measureStore = useKPIMeasureStore()

  useEffect(() => {
    if (strategyId) fetchSteps(strategyId)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strategyId])

  const objectives = useMemo(
    () => strategyMapStore.getEffectiveFinalObjectives(b3Selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strategyMapStore, b3Selected]
  )
  const allKpis = fishboneStore.getAllKPIs(objectives)
  const departments = fishboneStore.departments

  const configuredKpiIds = useMemo(
    () => new Set(allKpis.filter((k) => measureStore.isConfigured(k.id)).map((k) => k.id)),
    [allKpis, measureStore]
  )

  const completedCount = Object.values(steps).filter((s) => s.status === 'completed').length
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length
  const doneTasks = tasks.filter((t) => t.status === 'DONE').length
  const allDone = completedCount === 8

  const nextStep = STEPS.find((s) => {
    const status = steps[s.id]?.status
    return status === 'active' || status === 'pending'
  })

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-12">

      {/* ── Premium Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-black text-slate-800 tracking-tight leading-none mb-3">
            Tổng quan Chiến lược
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-50 text-[#3C50E0] rounded-lg font-bold border border-blue-100">
              Tiến độ: {completedCount}/8 Bước
            </span>
            {nextStep && (
              <span className="text-slate-500">
                Gợi ý tiếp theo: <button onClick={() => navigate(nextStep.to)} className="font-bold text-[#3C50E0] hover:underline">{nextStep.id} {nextStep.label}</button>
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Completion Banner */}
      {allDone && (
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[32px] p-8 sm:p-10 text-white shadow-xl shadow-emerald-500/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-teal-300/30 rounded-full blur-3xl translate-y-1/3" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center shrink-0 shadow-inner backdrop-blur-md">
              <Trophy size={40} className="text-yellow-300 drop-shadow-md" />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Chiến lược đã Sẵn sàng!</h2>
              <p className="text-white/90 text-sm sm:text-base font-medium">Toàn bộ 8 bước Balanced Scorecard đã được thiết lập. Hệ thống hiện đang trong giai đoạn Thực thi & Giám sát (B8).</p>
            </div>
            <button onClick={() => navigate('/action-plan')} className="mt-4 sm:mt-0 sm:ml-auto px-6 py-3.5 bg-white text-emerald-600 hover:bg-emerald-50 font-bold rounded-xl shadow-lg transition-colors shrink-0">
              Xem Kết quả Thực thi
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          label="Mục tiêu Chiến lược"
          value={objectives.length}
          sub={`Được chắt lọc từ ${b3Selected.length} cơ sở`}
          color="#9333ea"
          icon={Target}
          to="/strategy-map/perspectives"
          navigate={navigate}
        />
        <StatCard
          label="Chỉ số KPI (Đo lường)"
          value={allKpis.length}
          sub={`${configuredKpiIds.size} chỉ số đã thiết lập target`}
          color="#3C50E0"
          icon={TrendingUp}
          trend={allKpis.length > 0 ? `${Math.round((configuredKpiIds.size / allKpis.length) * 100)}%` : undefined}
          trendUp={configuredKpiIds.size === allKpis.length && allKpis.length > 0}
          to="/kpi-setup"
          navigate={navigate}
        />
        <StatCard
          label="Kế hoạch Hành động"
          value={actionPlans.length}
          sub={`Gồm ${tasks.length} công việc chi tiết`}
          color="#16a34a"
          icon={Flag}
          trend={tasks.length > 0 ? `${Math.round((doneTasks / tasks.length) * 100)}% done` : undefined}
          trendUp
          to="/action-plan"
          navigate={navigate}
        />
        <StatCard
          label="Rủi ro / Tắc nghẽn"
          value={blockedTasks}
          sub={blockedTasks > 0 ? 'Cần sự can thiệp của C-Level' : 'Quy trình trơn tru'}
          color={blockedTasks > 0 ? '#EF4444' : '#10B981'}
          icon={AlertTriangle}
          trend={blockedTasks > 0 ? 'Urgent' : 'Good'}
          trendUp={blockedTasks === 0}
          to="/action-plan"
          navigate={navigate}
          highlight={blockedTasks > 0}
        />
      </div>

      {/* BSC Timeline */}
      <WorkflowTimeline steps={STEPS} stepStatuses={steps} navigate={navigate} />

      {/* Blocked tasks alert */}
      <BlockedTasksAlert tasks={tasks} actionPlans={actionPlans} allKpis={allKpis} navigate={navigate} />

      {/* Perspectives Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {PERSPECTIVES.map((p) => (
            <PerspectiveCard
              key={p.id}
              p={p}
              objectives={objectives}
              kpis={allKpis}
              weight={perspectiveWeights[p.id] ?? 0}
              configuredKpis={configuredKpiIds}
              tasks={tasks}
              actionPlans={actionPlans}
            />
          ))}
        </div>
        <div className="space-y-6">
          <WeightDonut perspectiveWeights={perspectiveWeights} />
          <TaskStatusChart tasks={tasks} />
        </div>
      </div>

      {/* Bottom section: Departments & KPI Reports */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-2">
        <div className="space-y-6">
          <DeptParticipation departments={departments} objectives={objectives} kpis={allKpis} />
          {objectives.length === 0 && (
            <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-12 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layers size={36} className="text-slate-300" />
              </div>
              <p className="text-sm font-bold text-slate-500 mb-6">
                Chưa có dữ liệu phòng ban. Hãy hoàn thành các bước để xem tổng quan đầy đủ.
              </p>
              <button
                onClick={() => navigate(nextStep?.to ?? '/strategy-map/perspectives')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#3C50E0] text-white text-sm font-bold rounded-xl hover:bg-[#3142C4] hover:-translate-y-0.5 transition-all shadow-lg"
              >
                Bắt đầu từ {nextStep?.id ?? 'B1'} <ChevronRight size={16} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
        <KpiReportsFeed kpiReports={kpiReports} allKpis={allKpis} />
      </div>

    </div>
  )
}
