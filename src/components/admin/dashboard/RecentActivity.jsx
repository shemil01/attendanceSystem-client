"use client";

export default function RecentActivity({ activity }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h4 className="text-md font-medium text-gray-900 mb-4">
        Recent Activity
      </h4>
      <div className="space-y-3">
        {activity.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <span className="font-medium">{item.user}</span>{" "}
              <span className="text-gray-600">{item.action}</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(item.time).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
