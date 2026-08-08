import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type LineMetricChartProps<TData extends Record<string, string | number>> = {
  data: TData[];
  dataKey: keyof TData;
  xKey: keyof TData;
  stroke?: string;
};

export function LineMetricChart<TData extends Record<string, string | number>>({
  data,
  dataKey,
  xKey,
  stroke = '#0ea5e9',
}: LineMetricChartProps<TData>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
        <XAxis dataKey={String(xKey)} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Line type="monotone" dataKey={String(dataKey)} stroke={stroke} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
