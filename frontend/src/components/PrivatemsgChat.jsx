import React, { useState, useEffect, useContext } from "react";
import "./PrivatemsgChat.css";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { LoginContext } from "../context/LoginContext";
import alertSound from "../img/alert.m4a";

const PrivatemsgChat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { setMessage } = useContext(LoginContext);
  const { user } = useParams();
  const userId = localStorage.getItem("userId");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("", {
      query: {
        userId: userId,
      },
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setSocket(newSocket);
    });

    newSocket.on("servermsg", (msg) => {
      const newMessage = { text: msg, sender: "other" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      const newAudio = new Audio(alertSound);
      newAudio.play();
      setMessage(true);

      // Save message to local storage
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId, setMessage, messages]);

  useEffect(() => {
    const storedMessages = localStorage.getItem("messages");
    console.log(storedMessages)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

 }, [setMessage]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const sendMessageToServer = (message) => {
    if (socket) {
      socket.emit("sendmsg", { user: user, message: `Other:${message}` });
    } else {
      console.error("Socket connection not established yet.");
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = { text: `You:${inputValue}`, sender: "user" };
      setMessages([...messages, newMessage]);
      sendMessageToServer(inputValue);
      setInputValue("");

      // Save message to local storage
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "other"
              }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={inputValue}
          onChange={handleInputChange}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default PrivatemsgChat;
