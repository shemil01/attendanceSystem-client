"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../../context/AppContext";
import { apiClient } from "../../../lib/api";
import toast from "react-hot-toast";
import StatusCard from "./StatusCard";
import ActionButtons from "./ActionButton";
import TodayRecord from "./TodayRecord";

export default function TimeTracker({ currentUserId }) {
  const { todayAttendance, fetchTodayAttendance, dispatch } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [breakTime, setBreakTime] = useState(0);

  const userTodayAttendance = Array.isArray(todayAttendance)
    ? todayAttendance.find((r) => r.employee._id === currentUserId)
    : todayAttendance;

  const activeBreak = userTodayAttendance?.breaks?.find((b) => !b.end);
  const isOnBreak = !!activeBreak;
  const isCheckedIn = !!userTodayAttendance?.checkIn;
  const isCheckedOut = !!userTodayAttendance?.checkOut;

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getBaseElapsedTime = (record) => {
    if (!record?.checkIn) return 0;
    const now = record.checkOut
      ? new Date(record.checkOut).getTime()
      : Date.now();
    const checkInTime = new Date(record.checkIn).getTime();

    // Keep counting time even during break
    return now - checkInTime;
  };

  const getBaseBreakTime = (record) => {
    if (!record?.breaks) return 0;
    return (record.breaks || []).reduce((sum, b) => {
      const start = new Date(b.start).getTime();
      const end = b.end ? new Date(b.end).getTime() : Date.now();
      return sum + (end - start);
    }, 0);
  };

  useEffect(() => {
    if (!userTodayAttendance) return;

    setElapsedTime(getBaseElapsedTime(userTodayAttendance));
    setBreakTime(getBaseBreakTime(userTodayAttendance));

    const interval = setInterval(() => {
      setElapsedTime(getBaseElapsedTime(userTodayAttendance));
      setBreakTime(getBaseBreakTime(userTodayAttendance));
    }, 1000);

    return () => clearInterval(interval);
  }, [userTodayAttendance]);

  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      await apiClient.checkIn();
      toast.success("Checked in successfully");
      fetchTodayAttendance();
      dispatch({ type: "SET_REMINDERS", payload: [] });
    } catch (error) {
      toast.error(error.message || "Failed to check in");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setIsProcessing(true);
    try {
      await apiClient.checkOut();
      toast.success("Checked out successfully");
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.message || "Failed to check out");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBreak = async () => {
    if (!userTodayAttendance) return;

    setIsProcessing(true);
    try {
      if (isOnBreak) {
        await apiClient.endBreak();
        toast.success("Break ended");
      } else {
        await apiClient.startBreak();
        toast.success("Break started");
      }
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.message || "Failed to update break status");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          title="Status"
          value={
            isCheckedOut
              ? "Checked Out"
              : isOnBreak
              ? "On Break"
              : isCheckedIn
              ? "Working"
              : "Not Checked In"
          }
          bgColor="bg-blue-50"
          textColor="text-blue-800"
        />
        <StatusCard
          title="Time Worked"
          value={formatTime(elapsedTime)}
          bgColor="bg-green-50"
          textColor="text-green-800"
        />
        <StatusCard
          title="Break Time"
          value={formatTime(breakTime)}
          bgColor="bg-yellow-50"
          textColor="text-yellow-800"
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        isOnBreak={isOnBreak}
        isCheckedIn={isCheckedIn}
        isCheckedOut={isCheckedOut}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        onBreak={handleBreak}
        isProcessing={isProcessing}
      />

      {/* Today's Record */}
      <TodayRecord
        record={userTodayAttendance}
        breakTime={breakTime}
        formatTime={formatTime}
      />
    </div>
  );
}
