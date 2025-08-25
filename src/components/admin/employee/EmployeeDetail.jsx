"use client";

import { useState, useEffect } from "react";
import { apiClient } from "../../../lib/api";
import { Tab } from "@headlessui/react";
import { Clock, Calendar, TrendingUp } from "lucide-react";
import { clsx } from "../../../lib/utils";

import EmployeeHeader from "./EmployeeHeader";
import AttendanceCard from "./AttendanceCard";
import StatsCard from "./StatsCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EmployeeDetail({ employeeId, onBack }) {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (employeeId) fetchEmployeeData();
  }, [employeeId]);

  console.log("emp:", attendance);
  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);

      const empResponse = await apiClient.getEmployee(employeeId);
      setEmployee(empResponse.data.employee);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const historyResponse = empResponse.data.history;
      setHistory(historyResponse);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { name: "Today", icon: Clock },
    { name: "History", icon: Calendar },
    { name: "Stats", icon: TrendingUp },
  ];

  const stats = {
    totalDays: history.length,
    presentDays: history.filter((r) => r.status === "PRESENT").length,
    attendanceRate: history.length
      ? Math.round(
          (history.filter((r) => r.status === "PRESENT").length /
            history.length) *
            100
        )
      : 0,
  };

  if (isLoading) return <LoadingSpinner size="large" className="py-8" />;
  if (!employee)
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );

  return (
    <div className="space-y-4">
      <EmployeeHeader employee={employee} onBack={onBack} />

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
                  "flex items-center py-2 px-4 border-b-2 font-medium text-sm"
                )
              }
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels className="mt-4">
          {/* Today */}
          <Tab.Panel>
            {attendance ? (
              <AttendanceCard record={attendance} isToday />
            ) : (
              <p className="text-gray-500">No attendance recorded today</p>
            )}
          </Tab.Panel>

          {/* History */}
          <Tab.Panel className="space-y-3">
            {history.length > 0 ? (
              history.map((record) => (
                <AttendanceCard key={record._id} record={record} />
              ))
            ) : (
              <p className="text-gray-500">No attendance history</p>
            )}
          </Tab.Panel>

          {/* Stats */}
          <Tab.Panel className="grid grid-cols-2 gap-4">
            <StatsCard
              label="Present Days"
              value={stats.presentDays}
              color="blue"
            />
            <StatsCard
              label="Attendance Rate"
              value={`${stats.attendanceRate}%`}
              color="green"
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
