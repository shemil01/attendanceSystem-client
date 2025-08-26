export default function TodayRecord({ record, breakTime, formatTime }) {
  if (!record) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 mb-2">Today's Record</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">Check In:</span>{" "}
          {new Date(record.checkIn).toLocaleTimeString()}
        </div>
        <div>
          <span className="text-gray-600">Check Out:</span>{" "}
          {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "Not yet"}
        </div>
        <div>
          <span className="text-gray-600">Total Breaks:</span>{" "}
          {record.breaks?.length || 0}
        </div>
        <div>
          <span className="text-gray-600">Break Time:</span>{" "}
          {formatTime(breakTime)}
        </div>
      </div>
    </div>
  );
}
