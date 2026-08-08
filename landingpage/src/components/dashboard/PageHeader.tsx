type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-r from-white via-cyan-50/60 to-blue-50/70 border border-cyan-100 rounded-2xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm ${className ?? ''}`}>
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {description ? <p className="text-sm text-slate-600 mt-1">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
