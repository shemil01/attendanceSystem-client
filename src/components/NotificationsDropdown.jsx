"use client";
import { useState, useEffect } from "react";
import { Bell, Circle } from "lucide-react";
import { apiClient } from "@/lib/api"; // axios wrapper with token

export default function NotificationsDropdown({ socketNotifications }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiClient.getNotification();
        console.log('first',res)
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  // Add new socket notifications
  useEffect(() => {
    if (socketNotifications.length) {
      setNotifications((prev) => [...socketNotifications, ...prev]);
    }
  }, [socketNotifications]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 text-gray-400 hover:text-gray-600"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-100 font-semibold text-gray-800">
            Notifications
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n._id}
                  className={`px-4 py-3 text-sm hover:bg-gray-50 flex justify-between items-center ${
                    n.isRead ? "text-gray-600" : "text-gray-900 font-medium"
                  }`}
                >
                  <div>
                    <p>{n.title}</p>
                    <p className="text-xs text-gray-500">{n.message}</p>
                  </div>
                  {!n.isRead && <Circle className="h-3 w-3 text-blue-500" />}
                </li>
              ))
            ) : (
              <li className="px-4 py-6 text-sm text-gray-500 text-center">
                No notifications
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
