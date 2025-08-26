"use client";

export default function StatsCard({ label, value, color }) {
  return (
    <div className={`p-4 rounded-lg text-center ${color}-50`}>
      <div className={`text-2xl font-bold ${color}-900`}>{value}</div>
      <div className={`text-sm ${color}-700`}>{label}</div>
    </div>
  );
}
