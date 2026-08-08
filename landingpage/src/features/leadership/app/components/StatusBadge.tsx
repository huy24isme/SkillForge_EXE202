type Status = 'healthy' | 'at-risk' | 'critical';

interface StatusBadgeProps {
  status: Status;
  children: React.ReactNode;
}

const statusConfig = {
  healthy: {
    bg: 'bg-[#2ECC71]/10',
    text: 'text-[#2ECC71]',
    dot: 'bg-[#2ECC71]',
  },
  'at-risk': {
    bg: 'bg-[#F5A623]/10',
    text: 'text-[#F5A623]',
    dot: 'bg-[#F5A623]',
  },
  critical: {
    bg: 'bg-[#E74C3C]/10',
    text: 'text-[#E74C3C]',
    dot: 'bg-[#E74C3C]',
  },
};

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
      {children}
    </span>
  );
}
