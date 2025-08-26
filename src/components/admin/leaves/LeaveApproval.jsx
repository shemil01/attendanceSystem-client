"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import AlertMessage from "./AlertMessage";
import LeaveCard from "./LeaveCard";
import EmptyState from "./EmptyState";

const LeaveApproval = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLeaves = async () => {
    setError("");
    try {
      const res = await apiClient.getAllLeaves({ status: "PENDING" });
      setPendingLeaves(res.data.leaves || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave requests");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateLeaveStatus = async (leaveId, status) => {
    setLoading({ [leaveId]: status });
    setError("");
    setSuccess("");

    try {
      const response = await apiClient.updateLeaveStatus({ leaveId, status });
      if (response.error) throw new Error(response.error.message);

      setPendingLeaves((prev) => prev.filter((leave) => leave._id !== leaveId));
      setSuccess(`Leave request has been ${status.toLowerCase()} successfully`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({});
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Leave Management
        </h1>
        <p className="text-gray-600">Review and manage pending leave requests</p>
      </div>

      {/* Alert Messages */}
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />}

      {/* Pending Leaves */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pendingLeaves.map((leave) => (
          <LeaveCard
            key={leave._id}
            leave={leave}
            loading={loading}
            onUpdate={updateLeaveStatus}
          />
        ))}
      </div>

      {/* Empty State */}
      {pendingLeaves.length === 0 && !Object.keys(loading).length && (
        <EmptyState />
      )}
    </div>
  );
};

export default LeaveApproval;
