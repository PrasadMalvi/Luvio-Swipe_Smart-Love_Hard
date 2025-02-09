import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage } from "../store/messagesSlice";

const Chat = ({ userId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.message.messages[userId] || []);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      dispatch(sendMessage({ userId, message: newMessage }));
      setNewMessage("");
    }
  };

  return (
    <div>
      <h2>Chat with User {userId}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
