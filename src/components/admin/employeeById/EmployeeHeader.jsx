"use client";

import { ArrowLeft } from "lucide-react";

//  employee header component
export default function EmployeeHeader({ employee, onBack }) {
  return (
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
          <span className="text-sm text-gray-500">
            {employee.department || "No department"}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500">
            {employee.position || "No position"}
          </span>
        </div>
      </div>
    </div>
  );
}
