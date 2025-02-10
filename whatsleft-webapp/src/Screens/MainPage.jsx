import React, { useState, useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import SwipePage from "./SwipePage";
import Messages from "./Messages";
import Settings from "./Settings";
import Profile from "./Profile";
import Chat from "./Chat";
import { FaFire, FaComments, FaCog } from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";

const MainPage = () => {
  const [activePage, setActivePage] = useState("swipe");
  const [isMessagesOpen, setIsMessagesOpen] = useState(true);
  const [user, setUser] = useState({ name: "", profilePic: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5050/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.data.success && res.data.user) {
          const profilePicPath = res.data.user.profilePictures?.length
            ? `http://localhost:5050/${res.data.user.profilePictures[0]}`.replace(/\\/g, "/") // Convert \ to /
            : "https://via.placeholder.com/50"; // Fallback if no profile picture
  
          setUser({
            name: res.data.user.name,
            profilePic: profilePicPath,
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);
  

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-black text-white flex flex-col items-center py-6">
        <img
          src={require("../Components/Assets/newlogo.png")}
          className="h-[100px] w-auto mb-4"
          alt="Logo"
        />

        <div className="w-full flex items-center justify-between px-6 py-3 bg-black rounded-lg mb-4">
          <Link to="/homePage/profile" className="flex items-center cursor-pointer" onClick={() => setActivePage("profile")}>
            <img
              src={user.profilePic}
              className="w-15 h-20 rounded-xl mr-3 bg-inherit border-2 border-[#b25776]"
              alt="User"
            />
            <span className="text-lg">{user.name || "User"}</span>
          </Link>
          <Link to="/homePage/settings" className="cursor-pointer" onClick={() => setActivePage("settings")}>
            <FaCog size={24} />
          </Link>
        </div>

        <Link
          to="/homePage"
          className={`w-full flex items-center px-6 py-4 text-lg text-[#b25776] hover:bg-[#b25776] hover:text-white  ${activePage === "swipe" ? "bg-transparent" : ""}`}
          onClick={() => setActivePage("swipe")}
        >
          <FaFire className="mr-3 text-[#b25776] hover:bg-white" /> Swipe
        </Link>

        <div className="w-full px-6 py-4 text-lg hover:bg-[#b25776]  ">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsMessagesOpen(!isMessagesOpen)}>
            <div className="flex items-center">
              <FaComments className="mr-3" />
              <span>Messages</span>
            </div>
            {isMessagesOpen ? <IoMdArrowDropup size={20} /> : <IoMdArrowDropdown size={20} />}
          </div>
        </div>
      </div>
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
