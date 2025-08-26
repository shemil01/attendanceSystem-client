'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';

export default function NotificationListener() {
  const { data: session } = useSession();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket && session?.user?.id) {
      const handleNotification = (notification) => {
        
        // Show toast notification
        toast.success(notification.message, {
          duration: 5000,
          icon: notification.type === 'LEAVE_APPROVAL' ? '✅' : '❌'
        });
      };

      // Listen for new notifications
      socket.on('new-notification', handleNotification);

      // Cleanup
      return () => {
        socket.off('new-notification', handleNotification);
      };
    }
  }, [socket, session]);

  return null;
}