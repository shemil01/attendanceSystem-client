"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
  AlertCircle,
} from "lucide-react";
import { apiClient } from "@/lib/api";

const LeaveApproval = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.getAllLeaves({ status: "PENDING" });
      setPendingLeaves(res.data.leaves || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateLeaveStatus = async (leaveId, status) => {
    setLoading({ [leaveId]: status }); // mark only that button as loading
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.updateLeaveStatus({ leaveId, status });

      if (response.error) {
        throw new Error(
          response.error.message || "Failed to update leave status"
        );
      }

      setPendingLeaves((prev) => prev.filter((leave) => leave._id !== leaveId));
      setSuccess(`Leave request has been ${status.toLowerCase()} successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({});
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leave Management
        </h1>
        <p className="text-gray-600">
          Review and manage pending leave requests
        </p>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
          <span className="text-red-700">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Pending Leaves Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingLeaves.map((leave) => (
          <div
            key={leave._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">
                      {leave.employee?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {leave.employee?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  <Clock className="h-3 w-3 mr-1" />
                  {leave.status}
                </div>
              </div>

              {/* Leave Details */}
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

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => updateLeaveStatus(leave._id, "APPROVED")}
                  disabled={loading[leave._id] === "APPROVED"}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading[leave._id] === "APPROVED" ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </>
                  )}
                </button>

                <button
                  onClick={() => updateLeaveStatus(leave._id, "REJECTED")}
                  disabled={loading[leave._id] === "REJECTED"}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {loading[leave._id] === "REJECTED" ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && pendingLeaves.length === 0 && (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Pending Leave Requests
          </h3>
          <p className="text-gray-500">
            All leave requests have been processed.
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaveApproval;
