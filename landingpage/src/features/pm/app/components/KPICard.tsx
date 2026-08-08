import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function KPICard({ title, value, change, icon: Icon, trend = 'neutral', color = '#3AE7E1' }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-semibold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm mt-2 ${
              trend === 'up' ? 'text-[#2ECC71]' : trend === 'down' ? 'text-[#E74C3C]' : 'text-gray-500'
            }`}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
