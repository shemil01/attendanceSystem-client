"use client";

import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";
import { formatDate, formatTime } from "../../lib/utils";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Calendar } from "lucide-react";
import AttendanceChart from "./AttandanceChart";
import toast from "react-hot-toast";

export default function AttendanceHistory() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // default is "All"
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  useEffect(() => {
    filterAttendance();
  }, [selectedMonth, selectedYear, attendance]);

  const fetchAttendanceHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAttendanceHistory();
      setAttendance(response.data.attendance || []);
    } catch (error) {
      toast.error("Error fetching attendance history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAttendance = () => {
    if (selectedMonth === "all" && selectedYear === "all") {
      setFilteredAttendance(attendance);
      return;
    }

    const filtered = attendance.filter((record) => {
      const date = new Date(record.date);
      const monthMatches =
        selectedMonth === "all" || date.getMonth() === parseInt(selectedMonth);
      const yearMatches =
        selectedYear === "all" || date.getFullYear() === parseInt(selectedYear);
      return monthMatches && yearMatches;
    });

    setFilteredAttendance(filtered);
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  const getStatusBadge = (record) => {
    if (record.status === "ON_LEAVE") {
      return (
        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
          On Leave
        </span>
      );
    }
    if (record.checkIn && record.checkOut) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Present
        </span>
      );
    }
    if (record.checkIn && !record.checkOut) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          Working
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
        Absent
      </span>
    );
  };

  if (isLoading) {
    return <LoadingSpinner size="large" className="py-8" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Attendance History
          </h3>
          <p className="text-sm text-gray-500">View your attendance records</p>
        </div>

        <div className="flex gap-2">
          {/* Month Dropdown */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="input-field p-2"
          >
            <option value="all">All Months</option>
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input-field p-2"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredAttendance.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No attendance records
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No attendance records found for{" "}
            {selectedMonth === "all" ? "All Months" : months[selectedMonth]}{" "}
            {selectedYear === "all" ? "All Years" : selectedYear}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Working Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breaks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Break Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAttendance.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.checkIn
                        ? new Date(record.checkIn).toLocaleTimeString()
                        : "--:--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.checkOut
                        ? new Date(record.checkOut).toLocaleTimeString()
                        : "--:--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record?.workingTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.breaks?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(record?.totalBreakTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AttendanceChart />
    </div>
  );
}
