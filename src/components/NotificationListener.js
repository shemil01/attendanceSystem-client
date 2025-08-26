"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import toast from "react-hot-toast";

export default function NotificationListener() {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (notification) => {
      toast.success(notification.message);
    };

    socket.on("new-notification", handleNotification);

    return () => socket.off("new-notification", handleNotification);
  }, [socket]);

  return null;
}
