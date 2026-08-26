import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import API_URL from "../services/api";

export function useSocket(conversationId, onMessageReceived, onError) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const socketRef = useRef(null);

  // Stable refs for callbacks
  const onMessageReceivedRef = useRef(onMessageReceived);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
    onErrorRef.current = onError;
  }, [onMessageReceived, onError]);

  useEffect(() => {
    if (!conversationId) {
      setIsConnecting(false);
      return;
    }

    const socket = io(API_URL, {
      withCredentials: true,
      query: { conversationId },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    socket.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setIsConnecting(false);
      setIsConnected(false);
      if (onErrorRef.current) {
        onErrorRef.current("Unable to connect to real-time chat");
      }
    });

    socket.io.on("reconnect_attempt", () => {
      setIsConnecting(true);
    });

    socket.io.on("reconnect", () => {
      setIsConnecting(false);
      setIsConnected(true);
    });

    // Main message listener
    socket.on("receive_message", (message) => {
      if (onMessageReceivedRef.current) {
        onMessageReceivedRef.current(message);
      }
    });

    socket.on("error", (errorData) => {
      console.error("Socket error:", errorData);
      if (onErrorRef.current) {
        onErrorRef.current(errorData.message || "An error occurred");
      }
    });

    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("connect_error");
        socket.off("receive_message");
        socket.off("error");
        socket.io.off("reconnect_attempt");
        socket.io.off("reconnect");
        socket.disconnect();
      }
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (text) => {
      if (!socketRef.current || !isConnected) {
        console.warn("Socket not connected, cannot broadcast");
        return false;
      }
      if (!text || !text.trim()) return false;

      socketRef.current.emit("send_message", {
        conversationId,
        text: text.trim(),
      });
      return true;
    },
    [conversationId, isConnected]
  );

  return {
    isConnected,
    isConnecting,
    sendMessage,
  };
}

export default useSocket;