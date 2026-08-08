import type { TimeRange } from '@/features/saas-admin/app/types/analytics';

const options: Array<{ value: TimeRange; label: string }> = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '3m', label: 'Last 3 months' },
  { value: '1y', label: 'Last year' },
];

type TimeRangeFilterProps = {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

export function TimeRangeFilter({ value, onChange }: TimeRangeFilterProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-gradient-to-r from-[#3AE7E1] to-[#4CC9F0] text-[#0B1C2D] shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
