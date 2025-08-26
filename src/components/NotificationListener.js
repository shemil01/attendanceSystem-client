'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/context/SocketContext';
import toast from 'react-hot-toast';

export default function NotificationListener() {
  const { data: session } = useSession();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    const handleNotification = (notification) => {
      console.log('📩 New notification received:', notification);

      toast.success(notification.message, {
        duration: 5000,
        icon: notification.type === 'LEAVE_APPROVAL' ? '✅' : '❌',
      });
    };

    socket.on('new-notification', handleNotification);

    return () => {
      socket.off('new-notification', handleNotification);
    };
  }, [socket, session?.user?.id]);

  return null;
}
