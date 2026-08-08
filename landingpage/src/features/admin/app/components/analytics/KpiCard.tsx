import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type KpiCardProps = {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon?: ReactNode;
  gradient?: string;
};

export function KpiCard({ label, value, delta, positive = true, icon, gradient = 'from-white to-slate-50 border-slate-200' }: KpiCardProps) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm relative overflow-hidden ${gradient}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{value}</p>
          <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${
            positive ? 'text-emerald-600' : 'text-rose-600'
          }`}>
            {positive
              ? <TrendingUp className="w-3.5 h-3.5" />
              : <TrendingDown className="w-3.5 h-3.5" />}
            {delta}
          </div>
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-white/70 shadow-sm border border-white/80 shrink-0">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
