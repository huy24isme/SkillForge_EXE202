import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type BarMetricChartProps<TData extends Record<string, string | number>> = {
  data: TData[];
  xKey: keyof TData;
  barKey: keyof TData;
  fill?: string;
};

export function BarMetricChart<TData extends Record<string, string | number>>({
  data,
  xKey,
  barKey,
  fill = '#0ea5e9',
}: BarMetricChartProps<TData>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 10, left: -8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
        <XAxis dataKey={String(xKey)} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip />
        <Bar dataKey={String(barKey)} fill={fill} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
