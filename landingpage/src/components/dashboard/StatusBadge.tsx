type StatusTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  neutral: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-cyan-100 text-cyan-700',
};

export function StatusBadge({ label, tone = 'neutral' }: StatusBadgeProps) {
  return <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${toneClasses[tone]}`}>{label}</span>;
}
