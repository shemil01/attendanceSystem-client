"use client";

import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import EmployeeHeader from "./EmployeeHeader";
import EmployeeSearchAndFilter from "./EmployeeSearchAndFilter";
import EmployeeTable from "./EmployeeTable";
import AddEmployeeModal from "../AddEmployeeModal";


export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filtered = employees?.filter(
      (employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.getAllEmployees();
      setEmployees(response.data.employees);
    } catch (error) {
      toast.error("Failed to fetch employees");
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewEmployee = (employeeId) => setSelectedEmployeeId(employeeId);
  const handleBackToList = () => setSelectedEmployeeId(null);

  const handleDeleteEmployee = async (employeeId) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await apiClient.deleteEmployee(employeeId);
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Error deleting employee:", error);
    }
  };

  if (isLoading) return <LoadingSpinner size="large" className="py-8" />;
  if (selectedEmployeeId)
    return <EmployeeDetail employeeId={selectedEmployeeId} onBack={handleBackToList} />;

  return (
    <div className="space-y-4">
      <EmployeeHeader onAdd={() => setIsAddModalOpen(true)} />
      <EmployeeSearchAndFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <EmployeeTable
        employees={filteredEmployees}
        onView={handleViewEmployee}
        onDelete={handleDeleteEmployee}
      />
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onEmployeeAdded={fetchEmployees}
      />
    </div>
  );
}
