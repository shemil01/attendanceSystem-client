"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react";
import { useSocket } from "@/context/SocketContext";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { notifications, setNotifications } = useSocket();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClear = () => setNotifications([]);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Attendance System
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Bell className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-md shadow-lg overflow-hidden z-50">
                  <div className="p-2 flex justify-between items-center border-b">
                    <span className="font-semibold text-gray-700">
                      Notifications
                    </span>
                    <button
                      className="text-sm text-blue-500"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-2 text-sm text-gray-500">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className="p-2 hover:bg-gray-100 border-b"
                        >
                          <p className="text-sm">{notif.message}</p>
                          <span className="text-xs text-gray-400">
                            {new Date(notif.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <User className="h-8 w-8 rounded-full bg-gray-200 p-1 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {session.user.role.toLowerCase()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
