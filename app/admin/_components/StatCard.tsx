'use client';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  change?: string;
  changeType?: 'up' | 'down' | 'live';
  accentColor: string;
}

export default function StatCard({
  icon,
  value,
  label,
  change,
  changeType,
  accentColor,
}: StatCardProps) {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-2xl p-6 hover:border-[#9ca3af] hover:-translate-y-0.5 transition-all shadow-sm">
      {/* Icon Circle */}
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4"
        style={{
          backgroundColor: accentColor + '15',
        }}
      >
        {icon}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p
          className="text-[26px] font-bold"
          style={{ color: accentColor }}
        >
          {value}
        </p>
      </div>

      {/* Label */}
      <p className="text-[12px] text-[#6b7280] mb-3">{label}</p>

      {/* Change Indicator */}
      {changeType === 'live' ? (
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-[#16a34a] rounded-full animate-pulse"></span>
          <span className="text-[12px] font-semibold text-[#16a34a]">LIVE</span>
        </div>
      ) : change && changeType ? (
        <div className="flex items-center gap-1">
          <span
            className={`text-[12px] font-semibold ${
              changeType === 'up'
                ? 'text-[#16a34a]'
                : 'text-[#dc2626]'
            }`}
          >
            {changeType === 'up' ? '↑' : '↓'}
            {change}
          </span>
        </div>
      ) : null}
    </div>
  );
}
