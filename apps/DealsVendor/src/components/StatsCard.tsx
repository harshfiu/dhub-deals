interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  change?: string;
  changePositive?: boolean;
}

export default function StatsCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  change,
  changePositive,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <span style={{ color: iconColor }}>{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <p className="text-gray-900 text-2xl font-bold mt-0.5">{value}</p>
        {change && (
          <p className={`text-xs mt-1 font-medium ${changePositive ? "text-emerald-600" : "text-red-500"}`}>
            {changePositive ? "↑" : "↓"} {change} vs last month
          </p>
        )}
      </div>
    </div>
  );
}
