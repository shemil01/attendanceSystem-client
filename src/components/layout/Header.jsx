"use client";

import { useSession, signOut } from "next-auth/react";
import { Bell, LogOut, User } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

export default function Header() {
  const { data: session } = useSession();
  const { notifications } = useSocket();

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
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                {notifications?.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {notifications?.length}
                  </span>
                )}
              </button>
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
