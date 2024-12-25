import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const newSocket = io("/", { query: { userId } });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocket(newSocket);
    });

    newSocket.on("servermsg", (msg) => {
      const newMessage = { text: msg, sender: "other" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      // Save messages to localStorage
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [userId, messages]);

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, messages, setMessages }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
