import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import "./PrivatemsgChat.css";

const PrivatemsgChat = () => {
  const [inputValue, setInputValue] = useState("");
  const { socket, messages, setMessages } = useSocket();
  const { user } = useParams();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() !== "" && socket) {
      const newMessage = { text: `You:${inputValue}`, sender: "user" };
      setMessages([...messages, newMessage]);
      socket.emit("sendmsg", { user, message: `Other:${inputValue}` });
      setInputValue("");

      // Save messages to localStorage
      const updatedMessages = [...messages, newMessage];
      localStorage.setItem("messages", JSON.stringify(updatedMessages));
    }
  };

  const deleteMessages = () => {
    localStorage.removeItem("messages");
    setMessages([]);
  };

  return (
    <div className="chat-container">
      <button
        style={{ background: "red", width: "2em", marginTop: "5px" }}
        onClick={deleteMessages}
      >
        Delete
      </button>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.sender === "user" ? "user" : "other"
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
