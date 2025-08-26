import { io } from "socket.io-client";

let socket = null;

export const socketClient = {
  connect(token) {
    if (socket) return socket; 

    console.log("Connecting to socket server...");

    socket = io(process.env.NEXT_PUBLIC_API_URL || "https://attendancesystem-server-joov.onrender.com", {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });

    socket.on("connect_error", (err) => {
      console.error("⚠️ Socket connect error:", err.message);
    });

    return socket;
  },

  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
      console.log("🔌 Socket manually disconnected");
    }
  },

  getSocket() {
    return socket;
  },
};
