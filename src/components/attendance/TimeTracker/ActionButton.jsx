const { Play, Coffee, Square } = require("lucide-react");

export default function ActionButtons({
  isOnBreak,
  isCheckedIn,
  isCheckedOut,
  onCheckIn,
  onCheckOut,
  onBreak,
  isProcessing,
}) {
  if (!isCheckedIn) {
    return (
      <div className="flex justify-center">
        <button
          onClick={onCheckIn}
          disabled={isProcessing}
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="mr-2 h-5 w-5" /> Check In
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4">
      {!isCheckedOut && isCheckedIn && (
        <button
          onClick={onBreak}
          disabled={isProcessing}
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Coffee className="mr-2 h-5 w-5" />
          {isOnBreak ? "End Break" : "Take Break"}
        </button>
      )}

      {!isCheckedOut && (
        <button
          onClick={onCheckOut}
          disabled={isProcessing}
          className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Square className="mr-2 h-5 w-5" /> Check Out
        </button>
      )}
    </div>
  );
}
