import { io } from "socket.io-client";

// Create a simple socket instance manager
let socket = null;

export const socketClient = {
  connect(token) {
    if (socket) return socket;

    console.log("Connecting to socket server...");
    
    socket = io(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", {
      auth: { 
        token: token 
      },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("Socket disconnected");
    }
  },

  getSocket() {
    return socket;
  },

  isConnected() {
    return socket && socket.connected;
  }
};