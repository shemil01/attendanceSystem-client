"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Tab } from "@headlessui/react";
import { clsx } from "../../lib/utils";
import EmployeeManagement from "../admin/EmployeeManagement";
import LeaveApproval from "../admin/LeaveApproval";
import AttendanceOverview from "../admin/AttendanceOverview";
import Reports from "../admin/Reports";
import DashboardStats from "../admin/DashboardStats";
import AttendanceHistory from "../attendance/AttendanceHistory";
import TimeTracker from "../attendance/TimeTracker";
import TodayAttendance from "../attendance/TodayAttandance";
import SystemStats from "../admin/dashboard/SystemStats";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeToday: 0,
    onLeave: 0,
    pendingLeaves: 0,
  });

  const tabs = [
    { name: "Dashboard", component: SystemStats },
    { name: "Mark Attendence", component: TimeTracker },
    { name: "Admin Attendance History", component: AttendanceHistory }, 
    { name: "Employees", component: EmployeeManagement },
    { name: "Today's Attendance", component: TodayAttendance }, 
    { name: "Leave Requests", component: LeaveApproval },
    { name: "All Attendance", component: AttendanceOverview },
    { name: "Reports", component: Reports },
  ];

  // Fetch admin dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // This would be replaced with actual API call
        const mockStats = {
          totalEmployees: 47,
          activeToday: 32,
          onLeave: 5,
          pendingLeaves: 8,
        };
        setStats(mockStats);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {session.user.name}. Here's what's happening today.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Stats Overview */}

      <DashboardStats />
      {/* Main Content Tabs */}
      <div className="bg-white shadow rounded-lg">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  clsx(
                    selected
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    "flex-1 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
                  )
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="p-6">
            {tabs.map((tab, index) => (
              <Tab.Panel key={tab.name}>
                <tab.component />
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
