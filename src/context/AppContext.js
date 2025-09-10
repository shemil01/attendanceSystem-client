"use client";

import { createContext, useContext, useReducer, useEffect } from "react";
import { useSession } from "next-auth/react";

const AppContext = createContext();

const initialState = {
  todayAttendance: null,
  reminders: [],
  timeTracker: {
    isRunning: false,
    startTime: null,
    elapsedTime: 0,
    isOnBreak: false,
    breakStartTime: null,
    breakElapsedTime: 0,
  },
  notifications: [],
  employees: [],
  attendanceHistory: [],
  leaves: [],
  isLoading: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_REMINDERS":
      return { ...state, reminders: action.payload };
    case "SET_TODAY_ATTENDANCE":
      return { ...state, todayAttendance: action.payload };
    case "START_TIMER":
      return {
        ...state,
        timeTracker: {
          ...state.timeTracker,
          isRunning: true,
          startTime: action.payload,
        },
      };
    case "STOP_TIMER":
      return {
        ...state,
        timeTracker: {
          ...state.timeTracker,
          isRunning: false,
          elapsedTime: action.payload.elapsedTime,
        },
      };
    case "UPDATE_ELAPSED_TIME":
      return {
        ...state,
        timeTracker: {
          ...state.timeTracker,
          elapsedTime: action.payload,
        },
      };
    case "START_BREAK":
      return {
        ...state,
        timeTracker: {
          ...state.timeTracker,
          isOnBreak: true,
          breakStartTime: action.payload,
        },
      };
    case "END_BREAK":
      return {
        ...state,
        timeTracker: {
          ...state.timeTracker,
          isOnBreak: false,
          breakElapsedTime: state.timeTracker.breakElapsedTime + action.payload,
        },
      };
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 4)],
      };
    case "SET_EMPLOYEES":
      return { ...state, employees: action.payload };
    case "SET_ATTENDANCE_HISTORY":
      return { ...state, attendanceHistory: action.payload };
    case "SET_LEAVES":
      return { ...state, leaves: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { data: session } = useSession();

  // Fetch today's attendance on load
  useEffect(() => {
    if (session) {
      fetchTodayAttendance();
    }
  }, [session]);

  const fetchTodayAttendance = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await fetch(
        `https://attendancesystem-server-joov.onrender.com/api/attendance-one/today`,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.status === "reminder") {
          dispatch({ type: "SET_TODAY_ATTENDANCE", payload: null });
          dispatch({
            type: "SET_REMINDERS",
            payload: [{ message: data.message, type: "warning" }],
          });
          return;
        }

        dispatch({
          type: "SET_TODAY_ATTENDANCE",
          payload: data.data?.attendance,
        });

        if (
          data?.data?.attendance &&
          data.data.attendance.checkIn &&
          !data.data.attendance.checkOut
        ) {
          const startTime = new Date(data.data.attendance.checkIn).getTime();
          const elapsed = Date.now() - startTime;
          dispatch({ type: "START_TIMER", payload: startTime });
          dispatch({ type: "UPDATE_ELAPSED_TIME", payload: elapsed });
        }
      }
    } catch (error) {
      console.error("Error fetching today attendance:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value = {
    ...state,
    dispatch,
    fetchTodayAttendance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
