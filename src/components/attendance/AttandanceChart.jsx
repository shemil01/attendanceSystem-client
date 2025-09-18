"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import StatsCard from "../admin/employeeById/StatsCard";
import toast from "react-hot-toast";

export default function AttendanceChart() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserData(session.user.id);
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      const response = await apiClient.getEmployee(userId);
      setStats(response.data.stats);
    } catch (err) {
      toast.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Please log in</p>;
  if (!stats) return <p>No stats available</p>;
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatsCard label="Total Days" value={stats.totalDays} color="blue" />
      <StatsCard label="Present Days" value={stats.presentDays} color="blue" />
      <StatsCard
        label="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        color="green"
      />
    </div>
  );
}
