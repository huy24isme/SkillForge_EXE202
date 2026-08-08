import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const palette = ['#06b6d4', '#3b82f6', '#6366f1', '#14b8a6', '#f59e0b'];

type PieMetricChartProps<TData extends Record<string, string | number>> = {
  data: TData[];
  nameKey: keyof TData;
  valueKey: keyof TData;
};

export function PieMetricChart<TData extends Record<string, string | number>>({
  data,
  nameKey,
  valueKey,
}: PieMetricChartProps<TData>) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Pie
          data={data}
          dataKey={String(valueKey)}
          nameKey={String(nameKey)}
          cx="50%"
          cy="50%"
          outerRadius={105}
          innerRadius={55}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${String(entry[nameKey])}`} fill={palette[index % palette.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
