"use client";

import { Search, Filter } from "lucide-react";

export default function EmployeeSearchAndFilter({ searchTerm, setSearchTerm }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 input-field lg:py-3"
        />
      </div>
      <button className="btn-secondary">
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </button>
    </div>
  );
}
