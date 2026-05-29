"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";

  useEffect(() => {
    let socketInstance: Socket | null = null;

    const connectSocket = () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }

      // Read credentials from localStorage/session
      let userId = "";
      let role = "";

      try {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const userObj = JSON.parse(cachedUser);
          userId = userObj.id || "";
        }
        
        const cachedAdmin = localStorage.getItem("adminSession");
        if (cachedAdmin || window.location.pathname.startsWith("/admin")) {
          role = "admin";
        }
      } catch (err) {
        console.error("Failed to parse user/admin storage:", err);
      }

      console.log(`🔌 Initializing live Socket.io connection to ${BASE_URL} (User: ${userId || "guest"}, Role: ${role || "user"})`);

      socketInstance = io(BASE_URL, {
        query: {
          userId,
          role,
        },
        transports: ["websocket", "polling"],
        withCredentials: true,
      });

      socketInstance.on("connect", () => {
        console.log("✅ Socket.io connected successfully:", socketInstance?.id);
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        console.log("❌ Socket.io disconnected");
        setIsConnected(false);
      });

      // Listen for global real-time payment updates to automatically trigger Navbar updates
      socketInstance.on("payment_updated", (data: any) => {
        console.log("🔔 Real-time payment update received via Socket:", data);
        if (data.available !== undefined) {
          // Instantly sync layout Navbar balance!
          window.dispatchEvent(
            new CustomEvent("walletUpdated", { detail: data.available })
          );
        }
      });

      setSocket(socketInstance);
    };

    // Connect initially
    connectSocket();

    // Reconnect when auth state changes anywhere in the app
    const handleAuthChange = () => {
      console.log("🔄 Auth state changed, reconnecting socket...");
      connectSocket();
    };

    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [BASE_URL]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
