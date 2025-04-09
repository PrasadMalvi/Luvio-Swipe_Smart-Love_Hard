import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../store/messagesSlice";

const Chat = ({ userId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages.messages[userId] || []);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(sendMessage({ userId, message: newMessage }));
      setNewMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="w-96 border border-gray-300 rounded-lg p-4 flex flex-col bg-white shadow-lg">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Chat with User {userId}</h2>
      
      {/* Messages Container */}
      <div className="h-64 overflow-y-auto space-y-2 p-2 border-b border-gray-200">
        {messages.map((msg, index) => (
          <div key={index} className="p-2 bg-gray-100 rounded-lg w-fit max-w-xs">
            <p className="text-sm text-gray-800">{msg}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input & Send Button */}
      <div className="flex items-center mt-3 space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
