type DataTableProps = {
  headers: string[];
  children: React.ReactNode;
};

export function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50/60 border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-slate-50 to-cyan-50/60 text-slate-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="text-left px-4 py-3 font-medium">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}
