import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'review';
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}

interface UseSocketProps {
  onNewNotification?: (notification: Notification) => void;
  onUnreadCountUpdate?: (count: number) => void;
}

export const useSocket = ({ onNewNotification, onUnreadCountUpdate }: UseSocketProps = {}) => {
  const socketRef = useRef<Socket | null>(null);
  
  // Use useCallback to stabilize the handlers
  const handleNewNotification = useCallback((notification: Notification) => {
    console.log('📩 New notification received:', notification);
    onNewNotification?.(notification);
  }, [onNewNotification]);

  const handleUnreadCountUpdate = useCallback((count: number) => {
    console.log('🔢 Unread count updated:', count);
    onUnreadCountUpdate?.(count);
  }, [onUnreadCountUpdate]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    console.log('🔌 Connecting to socket at:', apiUrl);

    // Initialize socket connection - connect to base URL, NOT the namespace in URL
    socketRef.current = io(apiUrl, {
      path: '/socket.io', // Default Socket.IO path
      withCredentials: true,
      transports: ['polling', 'websocket'], // Start with polling, then upgrade
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Connected to notification server, socket ID:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from notification server:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected on attempt:', attemptNumber);
    });

    // Notification event handlers
    socket.on('newNotification', handleNewNotification);
    socket.on('unreadCount', handleUnreadCountUpdate);

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up socket connection');
      socket.off('newNotification', handleNewNotification);
      socket.off('unreadCount', handleUnreadCountUpdate);
      socket.disconnect();
    };
  }, [handleNewNotification, handleUnreadCountUpdate]);

  return socketRef.current;
};