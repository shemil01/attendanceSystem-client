"use client";

export default function AttendanceCard({ record, isToday = false }) {
  const formatTime = (time) =>
    time
      ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--";

  // Format minutes to "xh ym"
  const formatMinutes = (mins) => {
    if (!mins || mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m`;
  };

  // Check if currently in a break (last break has no end)
  const ongoingBreak =
    record.breaks && record.breaks.length > 0
      ? record.breaks.some((b) => !b.end)
      : false;

  return (
    <div
      className={`bg-white p-3 rounded-lg border shadow-sm ${
        isToday ? "bg-gray-50" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        {record.date && (
          <span className="font-medium">
            {new Date(record.date).toLocaleDateString()}
          </span>
        )}
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            ongoingBreak
              ? "bg-yellow-100 text-yellow-800"
              : record.status === "PRESENT"
              ? "bg-green-100 text-green-800"
              : record.status === "ON_LEAVE"
              ? "bg-purple-100 text-purple-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {ongoingBreak ? "IN BREAK" : record.status || "ABSENT"}
        </span>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>In: {formatTime(record.checkIn)}</span>
        <span>Out: {formatTime(record.checkOut)}</span>
      </div>

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>Working: {formatMinutes(record.workingTime)}</span>
        <span>Break: {formatMinutes(record.totalBreakTime)}</span>
      </div>

      {isToday && (
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Breaks: {record.breaks?.length || 0}</span>
          {ongoingBreak && <span className="text-yellow-600">Ongoing</span>}
        </div>
      )}
    </div>
  );
}
