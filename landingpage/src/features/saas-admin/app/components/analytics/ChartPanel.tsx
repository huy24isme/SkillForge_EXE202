import type { ReactNode } from 'react';

type ChartPanelProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  notes?: string[];
};

export function ChartPanel({ title, subtitle, children, notes }: ChartPanelProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      <div className="h-72">{children}</div>
      {notes && notes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 rounded-b-lg bg-slate-50/60 -mx-5 -mb-5 px-5 pb-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Ghi chú phân tích</p>
          <ul className="space-y-1.5">
            {notes.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-500">
                <svg className="mt-0.5 shrink-0 w-3.5 h-3.5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 16v-4M12 8h.01" />
                </svg>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
