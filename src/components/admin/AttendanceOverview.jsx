"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { formatDate } from "@/lib/utils";

export default function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
  });

  const fetchAttendance = async (page = 1) => {
    setLoading(true);
    try {
      const res = await apiClient.getAllEmployeesAttendence({
        page,
        limit: 50,
      });
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

  if (loading)
    return <p className="text-gray-500">Loading attendance overview...</p>;

  return (
    <div>
      {/* Table of Attendance */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Role</th>
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
                  <td className="px-4 py-2">{formatDate(a.date)}</td>
                  <td className="px-4 py-2">{a?.employee?.name || "N/A"}</td>
                  <td className="px-4 py-2">{a?.employee?.role || "N/A"}</td>
                  <td className="px-4 py-2">{a.status}</td>
                  <td className="px-4 py-2">
                    {a.checkIn
                      ? new Date(a.checkIn).toLocaleTimeString()
                      : "--"}
                  </td>
                  <td className="px-4 py-2">
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleTimeString()
                      : "--"}
                  </td>
                  <td className="px-4 py-2">{a.workingTime} mins</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No attendance records y
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
