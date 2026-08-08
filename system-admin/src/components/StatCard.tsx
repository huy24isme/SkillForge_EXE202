import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconTextColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  iconBgColor = 'bg-blue-50',
  iconTextColor = 'text-blue-600',
}) => {
  return (
    <div className="relative overflow-hidden bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl transition-colors duration-300 ${iconBgColor} ${iconTextColor} group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{subtext}</span>
        {trend && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
            trend.isPositive 
              ? 'bg-emerald-50 text-emerald-700' 
              : 'bg-rose-50 text-rose-700'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}
          </span>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};
