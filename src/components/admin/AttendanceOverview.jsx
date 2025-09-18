"use client";

import { useEffect, useState } from "react";
import { apiClient } from "../../lib/api";
import { formatDate, formatTime } from "@/lib/utils";
import toast from "react-hot-toast";
import Pagination from "../ui/Pagination";

export default function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 8;


    const totalPages = Math.ceil(attendanceData.length / dataPerPage);
  const startIndex = (currentPage - 1) * dataPerPage;
  const currentData = attendanceData.slice(startIndex, startIndex + dataPerPage);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  // const [pagination, setPagination] = useState({
  //   current: 1,
  //   pages: 1,
  //   total: 0,
  // });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getAllEmployeesAttendence();
      setAttendanceData((res.data.attendance || []).reverse());
      // setPagination(res.pagination);
    } catch (error) {
      toast.error("Error fetching attendance");
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-In
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Check-Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Working Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length > 0 ? (
              currentData.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(a.date)}{" "}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a?.employee?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a?.employee?.role || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a.checkIn
                      ? new Date(a.checkIn).toLocaleTimeString()
                      : "--"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {a.checkOut
                      ? new Date(a.checkOut).toLocaleTimeString()
                      : "--"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(a.workingTime)}
                  </td>
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
      {/* {pagination.pages > 1 && (
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
      )} */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
    </div>
  );
}
