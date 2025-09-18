import { Calendar } from "lucide-react";

export default function LeaveBalanceCard({ color, title, days }) {
  return (
    <div className={`bg-${color}-50 p-4 rounded-lg`}>
      <div className="flex items-center">
        <Calendar className={`h-6 w-6 text-${color}-600 mr-2`} />
        <div>
          <p className={`text-sm font-medium text-${color}-800`}>{title}</p>
          <p className={`text-2xl font-semibold text-${color}-900`}>
            {days} days
          </p>
        </div>
      </div>
    </div>
  );
}
