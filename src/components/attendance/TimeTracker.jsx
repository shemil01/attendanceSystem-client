"use client";

import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { apiClient } from "../../lib/api";
import toast from "react-hot-toast";
import { Play, Square, Coffee, History } from "lucide-react";

export default function TimeTracker() {
  const { todayAttendance, timeTracker, dispatch, fetchTodayAttendance } =
    useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (todayAttendance) {
      // condition if  user has checked in but not checked out
      if (todayAttendance.checkIn && !todayAttendance.checkOut) {
        const checkInTime = new Date(todayAttendance.checkIn).getTime();

        dispatch({ type: "START_TIMER", payload: checkInTime });

        // condition if currently on break
        const activeBreak = todayAttendance.breaks?.find((b) => !b.end);
        if (activeBreak) {
          dispatch({
            type: "START_BREAK",
            payload: new Date(activeBreak.start).getTime(),
          });
        } else {
          dispatch({
            type: "END_BREAK",
            payload: (todayAttendance.totalBreakTime || 0) * 60000,
          });
        }
      }

      // if user has already checked out   stop timer
      if (todayAttendance.checkOut) {
        const checkOutTime = new Date(todayAttendance.checkOut).getTime();
        dispatch({
          type: "STOP_TIMER",
          payload: { elapsedTime: todayAttendance.workingTime * 60000 },
        });
      }
    }
  }, [todayAttendance, dispatch]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleCheckIn = async () => {
    setIsProcessing(true);
    try {
      await apiClient.checkIn();
      dispatch({ type: "START_TIMER", payload: Date.now() });
      toast.success("Checked in successfully");
      fetchTodayAttendance();
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
      dispatch({
        type: "STOP_TIMER",
        payload: { elapsedTime: timeTracker.elapsedTime },
      });
      toast.success("Checked out successfully");
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.message || "Failed to check out");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBreak = async () => {
    setIsProcessing(true);
    try {
      if (timeTracker.isOnBreak) {
        await apiClient.endBreak();
        const breakDuration = Date.now() - timeTracker.breakStartTime;
        dispatch({ type: "END_BREAK", payload: breakDuration });
        toast.success("Break ended");
      } else {
        await apiClient.startBreak();
        dispatch({ type: "START_BREAK", payload: Date.now() });
        toast.success("Break started");
      }
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.message || "Failed to update break status");
    } finally {
      setIsProcessing(false);
    }
  };

  const isCheckedIn = todayAttendance?.checkIn && !todayAttendance?.checkOut;
  const isOnBreak = timeTracker.isOnBreak;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-blue-800">Status</h3>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            {todayAttendance?.checkOut
              ? "Checked Out"
              : isOnBreak
              ? "On Break"
              : todayAttendance?.checkIn
              ? "Working"
              : "Not Checked In"}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-green-800">Time Worked</h3>
          <p className="text-2xl font-bold text-green-900 mt-2">
            {formatTime(timeTracker.elapsedTime)}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <h3 className="text-sm font-medium text-yellow-800">Break Time</h3>
          <p className="text-2xl font-bold text-yellow-900 mt-2">
            {formatTime(timeTracker.breakElapsedTime)}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!todayAttendance?.checkIn ? (
          <button
            onClick={handleCheckIn}
            disabled={isProcessing}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="mr-2 h-5 w-5" />
            Check In
          </button>
        ) : !todayAttendance.checkOut ? (
          <>
            <button
              onClick={handleBreak}
              disabled={isProcessing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Coffee className="mr-2 h-5 w-5" />
              {isOnBreak ? "End Break" : "Take Break"}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={isProcessing}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square className="mr-2 h-5 w-5" />
              Check Out
            </button>
          </>
        ) : null}
      </div>

      {isOnBreak && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>
            You are currently on a break. The timer continues running for total
            work time.
          </p>
        </div>
      )}

      {todayAttendance && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Today's Record
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Check In:</span>{" "}
              {new Date(todayAttendance.checkIn).toLocaleTimeString()}
            </div>
            <div>
              <span className="text-gray-600">Check Out:</span>{" "}
              {todayAttendance.checkOut
                ? new Date(todayAttendance.checkOut).toLocaleTimeString()
                : "Not yet"}
            </div>
            <div>
              <span className="text-gray-600">Total Breaks:</span>{" "}
              {todayAttendance.breaks?.length || 0}
            </div>
            <div>
              <span className="text-gray-600">Break Time:</span>{" "}
              {formatTime((todayAttendance.totalBreakTime || 0) * 60000)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
