"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AttendanceChart({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="text-md font-medium text-gray-900 mb-4">
        Weekly Attendance
      </h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="present" fill="#10B981" name="Present" />
          <Bar dataKey="absent" fill="#EF4444" name="Absent" />
          <Bar dataKey="leave" fill="#6366F1" name="On Leave" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
