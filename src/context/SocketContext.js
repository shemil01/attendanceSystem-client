'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { socketClient } from '../lib/socket';

const SocketContext = createContext();

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
    if (session?.accessToken) {
      try {
        // Connect to Socket.io
        const socketInstance = socketClient.connect(session.accessToken);
        setSocket(socketInstance);

        // Set up event listeners
        const handleConnect = () => {
          console.log('Socket connected');
          setIsConnected(true);
          
          // Join user's personal room after connection
          if (session.user?.id) {
            socketInstance.emit('join-user-room', session.user.id);
          }
        };

        const handleDisconnect = () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        };

        socketInstance.on('connect', handleConnect);
        socketInstance.on('disconnect', handleDisconnect);

        // Cleanup function
        return () => {
          socketInstance.off('connect', handleConnect);
          socketInstance.off('disconnect', handleDisconnect);
          socketClient.disconnect();
        };
      } catch (error) {
        console.error('Failed to connect socket:', error);
      }
    }
  }, [session]);

  const value = {
    socket,
    isConnected: isConnected && socket?.connected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};