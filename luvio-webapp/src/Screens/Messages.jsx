import React, { useState } from "react";

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there!", sender: "You" },
    { id: 2, text: "Hello! How are you?", sender: "User" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="h-64 overflow-y-auto border p-2 rounded-md bg-gray-100">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded-md ${msg.sender === "You" ? "bg-blue-500 text-white text-right" : "bg-gray-300 text-black"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
