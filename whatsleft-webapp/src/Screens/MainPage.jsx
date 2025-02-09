import React, { useState } from "react";
import { Link, Routes, Route } from "react-router-dom";
import SwipePage from "./SwipePage";
import Messages from "./Messages";
import Settings from "./Settings";
import Profile from "./Profile";
import Chat from "./Chat"; // New Chat Component for right-side chat
import { FaFire, FaComments, FaCog } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io"; // Dropdown icons

const MainPage = () => {
  const [activePage, setActivePage] = useState("swipe");
  const [isMessagesOpen, setIsMessagesOpen] = useState(true); // Messages dropdown default open
  const [user] = useState({
    name: "John Doe",
    profilePic: "https://via.placeholder.com/50", // Replace with actual user image
  });

  // Dummy chat data (Replace with actual messages)
  const chats = [
    { id: "user1", name: "Alice", profilePic: "https://via.placeholder.com/50", lastMessage: "Hey! How are you?" },
    { id: "user2", name: "Bob", profilePic: "https://via.placeholder.com/50", lastMessage: "Are you free today?" },
    { id: "user3", name: "Charlie", profilePic: "https://via.placeholder.com/50", lastMessage: "Let's meet up!" },
  ];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-black text-white flex flex-col items-center py-6">
        {/* Logo at the Top */}
        <img
          src={require("../Components/Assets/newlogo.png")}
          className="h-[100px] w-auto mb-4"
          alt="Logo"
        />

        {/* Profile & Settings (Side by Side) */}
        <div className="w-full flex items-center justify-between px-6 py-3 bg-black rounded-lg mb-4">
          <Link
            to="/homePage/profile"
            className="flex items-center cursor-pointer"
            onClick={() => setActivePage("profile")}
          >
            <img
              src={user.profilePic}
              className="w-10 h-10 rounded-full mr-3 bg-[#b25776]"
              alt="User"
            />
            <span className="text-lg">{user.name}</span>
          </Link>
          <Link
            to="/homePage/settings"
            className="cursor-pointer"
            onClick={() => setActivePage("settings")}
          >
            <FaCog size={24} />
          </Link>
        </div>

        {/* Swipe Section */}
        <Link
          to="/homePage"
          className={`w-full flex items-center px-6 py-4 text-lg hover:bg-[#ecb9ca] ${
            activePage === "swipe" ? "bg-[#b25776]" : ""
          }`}
          onClick={() => setActivePage("swipe")}
        >
          <FaFire className="mr-3" /> Swipe
        </Link>

        {/* Messages Dropdown */}
        <div className="w-full px-6 py-4 text-lg hover:bg-[#ecb9ca]">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setIsMessagesOpen(!isMessagesOpen)}
          >
            <div className="flex items-center">
              <FaComments className="mr-3" />
              <span>Messages</span>
            </div>
            {isMessagesOpen ? (
              <IoMdArrowDropup size={20} />
            ) : (
              <IoMdArrowDropdown size={20} />
            )}
          </div>

          {/* Messages List */}
          {isMessagesOpen && (
            <div className="mt-2 bg-gray-800 rounded-lg p-2">
              {chats.map((chat) => (
                <Link
                  to={`/homePage/messages/${chat.id}`}
                  key={chat.id}
                  className="flex items-center px-3 py-2 hover:bg-gray-700 rounded-lg"
                >
                  <img
                    src={chat.profilePic}
                    className="w-12 h-12 rounded-full mr-3"
                    alt={chat.name}
                  />
                  <div className="flex-1">
                    <div className="text-white font-bold">{chat.name}</div>
                    <div className="text-gray-400 text-sm truncate">
                      {chat.lastMessage}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="/" element={<SwipePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
};

export default MainPage;
