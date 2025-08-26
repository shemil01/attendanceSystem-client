import { CheckCircle, XCircle, Clock, User, Calendar, FileText } from "lucide-react";

const LeaveCard = ({ leave, loading, onUpdate }) => {
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const calculateDays = (start, end) => {
    const diff = Math.abs(new Date(end) - new Date(start));
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header section*/}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-semibold text-gray-900">{leave.employee?.name}</h3>
              <p className="text-sm text-gray-500">{leave.employee?.email}</p>
            </div>
          </div>
          <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock className="h-3 w-3 mr-1" />
            {leave.status}
          </div>
        </div>

        {/* Details  section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span className="font-medium">{leave.leaveType}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
              <span className="ml-2 text-gray-500">
                ({calculateDays(leave.startDate, leave.endDate)} days)
              </span>
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-medium">Reason:</span>
            <p className="mt-1 text-gray-700">{leave.reason}</p>
          </div>
          <div className="text-xs text-gray-500">
            Applied on: {formatDate(leave.appliedDate)}
          </div>
        </div>

        {/* Actions here!!!! */}
        <div className="flex space-x-3">
          <ActionButton
            type="approve"
            isLoading={loading[leave._id] === "APPROVED"}
            onClick={() => onUpdate(leave._id, "APPROVED")}
          />
          <ActionButton
            type="reject"
            isLoading={loading[leave._id] === "REJECTED"}
            onClick={() => onUpdate(leave._id, "REJECTED")}
          />
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ type, isLoading, onClick }) => {
  const styles =
    type === "approve"
      ? "bg-green-600 hover:bg-green-700"
      : "bg-red-600 hover:bg-red-700";

  const Icon = type === "approve" ? CheckCircle : XCircle;
  const label = type === "approve" ? "Approve" : "Reject";

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex-1 ${styles} text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center`}
    >
      {isLoading ? (
        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Icon className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </button>
  );
};

export default LeaveCard;
