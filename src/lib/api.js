import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_URL,
  baseURL: "https://attendancesystem-server-joov.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include accessToken dynamically
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified request handler
const request = async (endpoint, options = {}) => {
  try {
    const response = await api({
      url: endpoint,
      ...options,
    });
    return response.data;
  } catch (error) {
    const errorMsg = error.response?.data?.message || error.message;
    console.error("API request failed:", errorMsg);
    throw new Error(errorMsg);
  }
};

// API methods
export const apiClient = {
  // Auth endpoints
  login: (credentials) =>
    request("/auth/login", {
      method: "POST",
      data: credentials,
    }),

  // Attendance endpoints
  checkIn: () =>
    request("/attendance/check-in", {
      method: "POST",
    }),

  // Checkout endpoint
  checkOut: () =>
    request("/attendance/check-out", {
      method: "POST",
    }),

  // Start a breake
  startBreak: (breakType = "SHORT_BREAK") =>
    request("/attendance/break/start", {
      method: "POST",
      data: { breakType },
    }),

  //  End the breake
  endBreak: () =>
    request("/attendance/break/end", {
      method: "POST",
    }),

  //  own attandance history
  getAttendanceHistory: (params = {}) =>
    request(`/attendance/history`, {
      method: "GET",
      params,
    }),
  /// todays attendance
  getTodayAttendance: (params = {}) =>
    request(`/attendance/today`, {
      method: "GET",
      params,
    }),

  // Leave endpoints
  applyLeave: (leaveData) =>
    request("/leaves", {
      method: "POST",
      data: leaveData,
    }),

  getMyLeaves: (params = {}) =>
    request("/leaves/my-leaves", {
      method: "GET",
      params,
    }),

  // Admin endpoints
  getAllEmployees: (params = {}) =>
    request("/employees", {
      method: "GET",
      params,
    }),

  // create a Employee(admin)
  createEmployee: (employeeData) =>
    request("/employees", {
      method: "POST",
      data: employeeData,
    }),

  // delete a Employee(admin)
  deleteEmployee: (employeeId) =>
    request(`/employees/${employeeId}`, {
      method: "DELETE",
    }),

  // all leaves
  getAllLeaves: (params = {}) =>
    request("/leaves", {
      method: "GET",
      params,
    }),
  // todatays leaves
  getTodayLeaves: () =>
    request("/today/leaves", {
      method: "GET",
    }),

  updateLeaveStatus: ({ leaveId, status }) =>
    request(`/leaves/${leaveId}`, {
      method: "PATCH",
      data: { status },
    }),

  // get a employee (id)
  getEmployee: (employeeId) =>
    request(`/employees/${employeeId}`, {
      method: "GET",
    }),

  // get all  attenedence
  getAllEmployeesAttendence: () =>
    request("/attendance/employees", {
      method: "GET",
    }),

  getEmployeeAttendance: (employeeId, params = {}) =>
    request(`/attendance/employee/${employeeId}?${params}`, {
      method: "GET",
    }),

  // get all  attenedence
  getNotification: () =>
    request("/notifications", {
      method: "GET",
    }),
};
