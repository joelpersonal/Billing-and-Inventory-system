import { 
  HiOutlineCube, 
  HiOutlineCurrencyDollar, 
  HiOutlineChartBarSquare,
  HiOutlineExclamationTriangle 
} from "react-icons/hi2";

export default function StatCard({ title, value, color = "purple", trend, icon }) {
  const colorSchemes = {
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-violet-500",
      text: "text-white",
      cardBg: "bg-gradient-to-br from-purple-50 to-violet-50",
      border: "border-purple-200"
    },
    green: {
      bg: "bg-gradient-to-br from-emerald-500 to-green-500",
      text: "text-white",
      cardBg: "bg-gradient-to-br from-emerald-50 to-green-50",
      border: "border-emerald-200"
    },
    blue: {
      bg: "bg-gradient-to-br from-blue-500 to-indigo-500",
      text: "text-white",
      cardBg: "bg-gradient-to-br from-blue-50 to-indigo-50",
      border: "border-blue-200"
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-rose-500",
      text: "text-white",
      cardBg: "bg-gradient-to-br from-red-50 to-rose-50",
      border: "border-red-200"
    },
  };

  const iconMap = {
    products: <HiOutlineCube size={24} />,
    revenue: <HiOutlineCurrencyDollar size={24} />,
    sales: <HiOutlineChartBarSquare size={24} />,
    alerts: <HiOutlineExclamationTriangle size={24} />,
    default: <HiOutlineCube size={24} />
  };

  const scheme = colorSchemes[color];
  const displayIcon = iconMap[icon] || iconMap.default;

  return (
    <div className={`${scheme.cardBg} ${scheme.border} border-2 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 fade-in group hover:scale-105`}>
      
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
            {value}
          </h2>
        </div>

        <div className={`w-14 h-14 rounded-2xl ${scheme.bg} ${scheme.text} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          {displayIcon}
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            trend.type === 'up' 
              ? 'bg-green-100 text-green-700' 
              : trend.type === 'down' 
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
          }`}>
            {trend.type === 'up' ? '↗' : trend.type === 'down' ? '↘' : '→'} {trend.value}
          </span>
          <span className="text-xs text-gray-500">{trend.period}</span>
        </div>
      )}

    </div>
  );
}
