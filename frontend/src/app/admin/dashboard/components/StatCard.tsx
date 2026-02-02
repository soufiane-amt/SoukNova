import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Stat } from "../../../../types/Stat.dt";

type StatCardProps = Stat;
const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {label}
      </h3>
      <span
        className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'up'
            ? 'bg-green-50 text-green-600'
            : 'bg-red-50 text-red-600'
        }`}
      >
        {trend === 'up' ? (
          <ArrowUpRight size={14} className="mr-1" />
        ) : (
          <ArrowDownRight size={14} className="mr-1" />
        )}
        {change}
      </span>
    </div>
    <div className="text-3xl font-semibold text-gray-900 truncate">{value}</div>
  </div>
);
export default StatCard;