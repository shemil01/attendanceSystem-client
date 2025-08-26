"use client";

import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";
import AttendanceChart from "./AttendanceChart";
import DepartmentChart from "./DepartmentChart";
import RecentActivity from "./RecentActivity";

export default function SystemStats() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceResponse = await apiClient.getAllEmployeesAttendence();
        const attendanceByDay = {};

        attendanceResponse.data.attendance.forEach((record) => {
          const day = new Date(record.date).toLocaleDateString("en-US", {
            weekday: "short",
          });
          if (!attendanceByDay[day])
            attendanceByDay[day] = { day, present: 0, absent: 0, leave: 0 };

          if (record.status === "PRESENT") attendanceByDay[day].present += 1;
          else if (record.status === "ON_LEAVE") attendanceByDay[day].leave += 1;
          else attendanceByDay[day].absent += 1;
        });

        setAttendanceData(Object.values(attendanceByDay));

      //  Department data
        const employeesResponse = await apiClient.getAllEmployees();
        const deptCounts = {};
        employeesResponse.data.employees.forEach((emp) => {
          if (!emp.department) return;
          deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
        });

        setDepartmentData(
          Object.entries(deptCounts).map(([name, value]) => ({
            name,
            value,
          }))
        );

        // recent activity
        const leavesResponse = await apiClient.getAllLeaves();
        const activity = [];

        // recent leaves
        leavesResponse.data.leaves.slice(-5).forEach((leave) => {
          activity.push({
            action: `requested ${leave.leaveType.toLowerCase().replace("_", " ")}`,
            user: leave.employee?.name || "Unknown",
            time: new Date(leave.createdAt).toISOString(),
          });
        });

        // recent attendance
        attendanceResponse.data.attendance.slice(-5).forEach((record) => {
          activity.push({
            action: record.checkIn ? "checked in" : "absent",
            user: record.employee?.name || "Unknown",
            time: new Date(record.date).toISOString(),
          });
        });

        // sort latest first
        activity.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivity(activity.slice(0, 5));
      } catch (err) {
        console.error("Error fetching system stats:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
        <p className="text-sm text-gray-500">
          Weekly attendance and department distribution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AttendanceChart data={attendanceData} />
        <DepartmentChart data={departmentData} />
      </div>

      <RecentActivity activity={recentActivity} />
    </div>
  );
}
