'use client';

import { useSession } from 'next-auth/react';
import { AppProvider } from '../context/AppContext';
import LoginForm from '@/components/auth/LoginPage';
import Dashboard from '@/components/dashboard/Dashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';


export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <LoginForm />;
  }

  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}