'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { socketClient } from '../lib/socket';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.accessToken) return;

    const socketInstance = socketClient.connect(session.accessToken);
    setSocket(socketInstance);

    const handleConnect = () => {
      setIsConnected(true);
      console.log('🔗 Socket connected');

      if (session.user?.id) {
        socketInstance.emit('join-user-room', session.user.id);
        console.log(`Joined room: user-${session.user.id}`);
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('🔌 Socket disconnected');
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketClient.disconnect();
    };
  }, [session?.accessToken, session?.user?.id]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
