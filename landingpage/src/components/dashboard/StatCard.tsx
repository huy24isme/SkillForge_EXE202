type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
};

export function StatCard({ label, value, hint, className }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm ${className ?? ''}`}>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-3xl font-semibold text-slate-900 mt-2">{value}</p>
      {hint ? <p className="text-xs text-slate-500 mt-1">{hint}</p> : null}
    </div>
  );
}
