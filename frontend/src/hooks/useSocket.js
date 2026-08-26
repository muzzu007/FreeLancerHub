import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import API_URL from "../services/api";

export function useSocket(conversationId, onMessageReceived, onError) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!conversationId) {
      setIsConnecting(false);
      return;
    }

    console.log("🔵 Connecting to socket for conversation:", conversationId);

    const socket = io(API_URL, {
      withCredentials: true,
      query: { conversationId },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    window.__socket = socket; // ✅ EXPOSE FOR TESTING

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Socket connected!");
      setIsConnected(true);
      setIsConnecting(false);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
      setIsConnecting(false);
      if (onError) onError("Unable to connect to real-time chat");
    });

    // ✅ LISTEN FOR MESSAGES
    socket.on("receive_message", (message) => {
      console.log("📨 SOCKET RECEIVED MESSAGE:", message);
      console.log("📨 Message text:", message?.text);
      console.log("📨 Sender:", message?.sender?.name);
      
      // Try both: direct call and callback
      if (onMessageReceived) {
        console.log("📨 Calling onMessageReceived callback");
        onMessageReceived(message);
      } else {
        console.warn("⚠️ onMessageReceived callback is undefined!");
      }
    });

    socket.on("error", (errorData) => {
      console.error("❌ Socket error:", errorData);
      if (onError) onError(errorData.message || "An error occurred");
    });

    // Cleanup
    return () => {
      console.log("🧹 Cleaning up socket");
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("receive_message");
        socket.off("error");
        socket.disconnect();
      }
      window.__socket = null;
    };
  }, [conversationId, onMessageReceived, onError]);

  const sendMessage = (text) => {
    console.log("📤 sendMessage called");
    console.log("📤 socket exists?", !!socketRef.current);
    console.log("📤 isConnected:", isConnected);

    if (!socketRef.current || !isConnected) {
      console.warn("⚠️ Cannot send: socket not connected");
      return false;
    }

    if (!text || !text.trim()) return false;

    console.log("📤 Emitting send_message with:", { conversationId, text: text.trim() });
    socketRef.current.emit("send_message", {
      conversationId,
      text: text.trim(),
    });

    return true;
  };

  return {
    socket: socketRef.current,
    isConnected,
    isConnecting,
    sendMessage,
  };
}

export default useSocket;