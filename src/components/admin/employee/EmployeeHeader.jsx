"use client";

import { Plus } from "lucide-react";

export default function EmployeeHeader({ onAdd }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Employee Management</h3>
        <p className="text-sm text-gray-500">Manage all employees in the system</p>
      </div>
      <button onClick={onAdd} className="btn-primary">
        <Plus className="h-4 w-4 mr-2" />
        Add Employee
      </button>
    </div>
  );
}
