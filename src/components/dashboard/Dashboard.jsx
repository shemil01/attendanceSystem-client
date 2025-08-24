'use client';

import { useSession } from 'next-auth/react';

import { ROLES } from '../../lib/rbac';
import Header from '../layout/Header';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session.user.role === ROLES.ADMIN ? (
          <AdminDashboard />
        ) : (
          <EmployeeDashboard />
        )}
      </main>
    </div>
  );
}