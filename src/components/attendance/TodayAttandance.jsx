"use client";

import { useState, useEffect } from "react";
import { apiClient } from "../../lib/api";
import { formatDate, calculateWorkingHours } from "../../lib/utils";
import LoadingSpinner from "../ui/LoadingSpinner";
import { Calendar, Clock, AlertCircle } from "lucide-react";

export default function TodayAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedMonth, selectedYear]);

  const fetchAttendanceHistory = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getTodayAttendance();
      // Wrap single attendance object in an array
      setAttendance(response.data.attendance ? [response.data.attendance] : []);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setIsLoading(false);
    }
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
  // If status is leave
  if (record.status === "ON_LEAVE") {
    return (
      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
        On Leave
      </span>
    );
  }

  // If user has an active break (no end time yet)
  const activeBreak = record.breaks?.find((b) => !b.end);
  if (activeBreak) {
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        On Break
      </span>
    );
  }

  // If user is checked in and checked out
  if (record.checkIn && record.checkOut) {
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
        Present
      </span>
    );
  }

  // If user checked in but not checked out
  if (record.checkIn && !record.checkOut) {
    return (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
        Working
      </span>
    );
  }

  // Else, absent
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
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="input-field p-2"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="input-field"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {attendance.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No attendance records
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No attendance records found for {months[selectedMonth]}{" "}
            {selectedYear}
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
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Working Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Breaks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance?.map((record) => (
                  <tr key={record._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.employee ? record.employee.name : "--:--"}
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
                      {record.checkIn && record.checkOut ? (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {calculateWorkingHours(
                            record.checkIn,
                            record.checkOut,
                            record.breaks
                          )}
                        </div>
                      ) : (
                        "--:--"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.breaks?.length || 0}
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

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Working hours are calculated by subtracting break times from the
              total time between check-in and check-out.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
