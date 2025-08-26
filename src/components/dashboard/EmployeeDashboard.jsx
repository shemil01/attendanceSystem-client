"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useApp } from "../../context/AppContext";
import TimeTracker from "../attendance/TimeTracker";
import { Tab } from "@headlessui/react";
import { clsx } from "../../lib/utils";
import AttendanceHistory from "../attendance/AttendanceHistory";
import LeaveRequestForm from "../leaves/LeaveRequestForm";
import LeaveHistory from "../leaves/LeaveHistory";

export default function EmployeeDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const { todayAttendance, isLoading } = useApp();
  const { data: session } = useSession();

  const tabs = [
    { name: "Time Tracker", component: TimeTracker },
    { name: "Attendance History", component: AttendanceHistory },
    { name: "Leave History", component: LeaveHistory },
    { name: "Leave Request", component: LeaveRequestForm },
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">
          Welcome back, {session.user.name}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {session.user.role} Dashboard
        </p>
      </div>

      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List
          className=" flex border-b border-gray-200 
      overflow-x-auto flex-nowrap scrollbar-hide
      md:overflow-visible md:flex-wrap"
        >
          {tabs.map((tab, index) => (
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
  );
}
