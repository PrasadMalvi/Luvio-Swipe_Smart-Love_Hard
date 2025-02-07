import { useState } from "react";
import { FaUser, FaHeart, FaComments, FaCog } from "react-icons/fa";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePic: "https://via.placeholder.com/150",
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-[#b25776] text-white p-5 flex flex-col space-y-6">
        <h2 className="text-2xl font-bold">Dating App</h2>
        <button onClick={() => setActiveTab("profile")} className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#e887a9]">
          <FaUser /> <span>Profile</span>
        </button>
        <button onClick={() => setActiveTab("matches")} className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#e887a9]">
          <FaHeart /> <span>Matches</span>
        </button>
        <button onClick={() => setActiveTab("messages")} className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#e887a9]">
          <FaComments /> <span>Messages</span>
        </button>
        <button onClick={() => setActiveTab("settings")} className="flex items-center space-x-2 p-3 rounded-md hover:bg-[#e887a9]">
          <FaCog /> <span>Settings</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-4/5 p-10">
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full mb-4" />
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        {activeTab === "matches" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Matches</h2>
            <p>Here are your recommended matches.</p>
          </div>
        )}
        {activeTab === "messages" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <p>Your recent conversations appear here.</p>
          </div>
        )}
        {activeTab === "settings" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p>Manage your account settings here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;