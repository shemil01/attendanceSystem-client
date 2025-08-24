"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";

export default function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  const fetchAttendance = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.getAllEmployeesAttendence({ page, limit: 50 });
      setAttendanceData(res.data.attendance || []);
      setPagination(res.pagination);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading) return <p className="text-gray-500">Loading attendance overview...</p>;

  // summary counts
  const totalEmployees = attendanceData.length;
  const present = attendanceData.filter((a) => a.status === "PRESENT").length;
  const absent = attendanceData.filter((a) => a.status === "ABSENT").length;
  const onLeave = attendanceData.filter((a) => a.status === "ON_LEAVE").length;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Overview (Today)</h3>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-100 rounded-lg shadow">
          <p className="text-sm text-gray-700">Present</p>
          <p className="text-xl font-bold text-green-700">{present}</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg shadow">
          <p className="text-sm text-gray-700">Absent</p>
          <p className="text-xl font-bold text-red-700">{absent}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded-lg shadow">
          <p className="text-sm text-gray-700">On Leave</p>
          <p className="text-xl font-bold text-yellow-700">{onLeave}</p>
        </div>
      </div>

      {/* Table of Attendance */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Check-In</th>
              <th className="px-4 py-2">Check-Out</th>
              <th className="px-4 py-2">Working Time</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length > 0 ? (
              attendanceData.map((a) => (
                <tr key={a._id} className="border-t">
                  <td className="px-4 py-2">{a?.employee?.name || "N/A"}</td>
                  <td className="px-4 py-2">{a.status}</td>
                  <td className="px-4 py-2">
                    {a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : "--"}
                  </td>
                  <td className="px-4 py-2">
                    {a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "--"}
                  </td>
                  <td className="px-4 py-2">{a.workingTime} mins</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No attendance records for today
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          {Array.from({ length: pagination.pages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded ${
                pagination.current === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => fetchAttendance(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
