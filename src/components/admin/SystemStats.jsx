import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function SystemStats() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch attendance history
        const attendanceResponse = await apiClient.getAllEmployeesAttendence();
        // Example structure: attendanceResponse.data.attendance = [{ employeeId, checkIn, checkOut, date, ... }]
        const attendanceByDay = {};

        attendanceResponse.data.attendance.forEach(record => {
          const day = new Date(record.date).toLocaleDateString("en-US", { weekday: "short" });
          if (!attendanceByDay[day]) attendanceByDay[day] = { day, present: 0, absent: 0, late: 0 };
          if (record.checkIn) attendanceByDay[day].present += 1;
          else attendanceByDay[day].absent += 1;
          if (record.late) attendanceByDay[day].late += 1;
        });

        setAttendanceData(Object.values(attendanceByDay));

        // Fetch all employees
        const employeesResponse = await apiClient.getAllEmployees();
        const deptCounts = {};
        employeesResponse.data.employees.forEach(emp => {
          deptCounts[emp.department] = (deptCounts[emp.department] || 0) + 1;
        });
        setDepartmentData(
          Object.entries(deptCounts).map(([name, value]) => ({ name, value }))
        );

        // Recent Activity: combine leaves and attendance
        const leavesResponse = await apiClient.getAllLeaves();
        const activity = [];

        // Recent leaves
        leavesResponse.data.leaves.slice(-5).forEach(leave => {
          activity.push({
            action: "requested leave",
            user: leave.employee.name,
            time: new Date(leave.appliedDate).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          });
        });

        // Recent attendance
        attendanceResponse.data.attendance.slice(-5).forEach(record => {
          activity.push({
            action: record.checkIn ? "checked in" : "checked out",
            user: record.employee.name,
            time: new Date(record.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          });
        });

        // Sort descending by time
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
        <p className="text-sm text-gray-500">Weekly attendance and department distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Weekly Attendance</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="present" fill="#10B981" name="Present" />
              <Bar dataKey="absent" fill="#EF4444" name="Absent" />
              <Bar dataKey="late" fill="#F59E0B" name="Late" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-md font-medium text-gray-900 mb-4">Employees by Department</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-md font-medium text-gray-900 mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div>
                <span className="font-medium">{activity.user}</span>{' '}
                <span className="text-gray-600">{activity.action}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
