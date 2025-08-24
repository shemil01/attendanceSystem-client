// app/components/admin/EmployeeDetail.js
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { apiClient } from '../../lib/api';
import { formatDate, calculateWorkingHours, clsx } from '../../lib/utils';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Tab } from '@headlessui/react';
import { Calendar, Clock, TrendingUp, ArrowLeft } from 'lucide-react';

export default function EmployeeDetail({ employeeId, onBack }) {
  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const { data: session } = useSession();

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeData();
    }
  }, [employeeId]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch employee details
      const empResponse = await apiClient.getEmployee(employeeId);
      setEmployee(empResponse.data.employee);
      
      // Fetch today's attendance
      const today = new Date().toISOString().split('T')[0];
      const todayResponse = await apiClient.getEmployeeAttendance(employeeId, { date: today });
      setAttendance(todayResponse.data.attendance?.[0] || null);
      
      // Fetch last 7 days history
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      const historyResponse = await apiClient.getEmployeeAttendance(employeeId, {
        startDate: startDate.toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      });
      setHistory(historyResponse.data.attendance || []);
      
    } catch (error) {
      console.error('Error fetching employee data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { name: 'Today', icon: Clock },
    { name: 'History', icon: Calendar },
    { name: 'Stats', icon: TrendingUp },
  ];

  const calculateStats = () => {
    const presentDays = history.filter(record => 
      record.status === 'PRESENT' || (record.checkIn && record.checkOut)
    ).length;

    return {
      totalDays: history.length,
      presentDays,
      attendanceRate: history.length > 0 ? Math.round((presentDays / history.length) * 100) : 0
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return <LoadingSpinner size="large" className="py-8" />;
  }

  if (!employee) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Employee not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{employee.name}</h2>
          <p className="text-gray-600">{employee.email}</p>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-sm text-gray-500">{employee.department || 'No department'}</span>
            <span className="text-sm text-gray-500">•</span>
            <span className="text-sm text-gray-500">{employee.position || 'No position'}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                clsx(
                  selected
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'flex items-center py-2 px-4 border-b-2 font-medium text-sm'
                )
              }
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="mt-4">
          {/* Today's Attendance */}
          <Tab.Panel>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Today's Attendance</h3>
              {attendance ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {attendance.checkIn 
                          ? new Date(attendance.checkIn).toLocaleTimeString()
                          : '--:--'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {attendance.checkOut 
                          ? new Date(attendance.checkOut).toLocaleTimeString()
                          : '--:--'
                        }
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        attendance.status === 'PRESENT' 
                          ? 'bg-green-100 text-green-800'
                          : attendance.status === 'ON_LEAVE'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendance.status || 'ABSENT'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Breaks:</span>
                      <span className="font-medium">
                        {attendance.breaks?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No attendance recorded today</p>
              )}
            </div>
          </Tab.Panel>

          {/* History */}
          <Tab.Panel>
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Last 7 Days</h3>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((record) => (
                    <div key={record._id} className="bg-white p-3 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{formatDate(record.date)}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.status === 'PRESENT' 
                            ? 'bg-green-100 text-green-800'
                            : record.status === 'ON_LEAVE'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {record.status || 'ABSENT'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>In: {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '--:--'}</span>
                        <span>Out: {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '--:--'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attendance history</p>
              )}
            </div>
          </Tab.Panel>

          {/* Stats */}
          <Tab.Panel>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-900">{stats.presentDays}</div>
                <div className="text-sm text-blue-700">Present Days</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-900">{stats.attendanceRate}%</div>
                <div className="text-sm text-green-700">Attendance Rate</div>
              </div>
            </div>
            
            <div className="mt-4 bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Records:</span>
                  <span className="font-medium">{stats.totalDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Present:</span>
                  <span className="font-medium text-green-600">{stats.presentDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Absent/Leave:</span>
                  <span className="font-medium text-red-600">{stats.totalDays - stats.presentDays}</span>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}