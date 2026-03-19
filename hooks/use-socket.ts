"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function useSocket(userId?: string, onNotification?: (payload: any) => void) {
  useEffect(() => {
    if (!userId) {
      return;
    }

    socket = io(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000", {
      path: "/api/socket/io",
      transports: ["websocket"]
    });

    socket.emit("join:user", userId);

    if (onNotification) {
      socket.on("notification:new", onNotification);
    }

    return () => {
      if (onNotification) {
        socket?.off("notification:new", onNotification);
      }
      socket?.disconnect();
    };
  }, [onNotification, userId]);
}
