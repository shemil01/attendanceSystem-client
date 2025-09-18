"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { apiClient } from "../../lib/api";
import toast from "react-hot-toast";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import LeaveBalanceCard from "./ui/LeaveBalanceCard";

export default function LeaveRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const calculateLeaveDays = () => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    return diffDays;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await apiClient.applyLeave(data);
      toast.success("Leave request submitted successfully");
      reset();
    } catch (error) {
      toast.error(error.message || "Failed to submit leave request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveTypes = [
    { value: "SICK_LEAVE", label: "Sick Leave" },
    { value: "CASUAL_LEAVE", label: "Casual Leave" },
    { value: "EARNED_LEAVE", label: "Earned Leave" },
    { value: "MATERNITY_LEAVE", label: "Maternity Leave" },
    { value: "PATERNITY_LEAVE", label: "Paternity Leave" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Request Leave</h3>
        <p className="text-sm text-gray-500">
          Submit a new leave request for approval
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow rounded-lg p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Leave Type
            </label>
            <select
              {...register("leaveType", { required: "Leave type is required" })}
              className="input-field mt-1 p-3"
            >
              <option value="">Select leave type</option>
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.leaveType && (
              <p className="mt-1 text-sm text-red-600">
                {errors.leaveType.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                min={new Date().toISOString().split("T")[0]}
                className="input-field mt-1 p-3"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate", {
                  required: "End date is required",
                  validate: (value) => {
                    if (startDate && new Date(value) < new Date(startDate)) {
                      return "End date cannot be before start date";
                    }
                    return true;
                  },
                })}
                min={startDate || new Date().toISOString().split("T")[0]}
                className="input-field mt-1 p-3"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {startDate && endDate && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm text-blue-700">
                Leave duration: {calculateLeaveDays()} day
                {calculateLeaveDays() !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reason
          </label>
          <textarea
            rows={4}
            {...register("reason", {
              required: "Reason is required",
              minLength: {
                value: 10,
                message: "Reason must be at least 10 characters long",
              },
              maxLength: {
                value: 500,
                message: "Reason cannot exceed 500 characters",
              },
            })}
            className="input-field mt-1 p-3"
            placeholder="Please provide a detailed reason for your leave request..."
          />
          {errors.reason && (
            <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
          )}
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your leave request will be sent to the administrator for
                approval. You will receive a notification once it's processed.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Submitting..." : "Submit Leave Request"}
          </button>
        </div>
      </form>

      <LeaveBalanceCard />
    </div>
  );
}
