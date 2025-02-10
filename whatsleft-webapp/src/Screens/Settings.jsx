import React from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove token
    navigate("/"); // Redirect to login page
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      <p className="text-gray-700 mb-4">Update your preferences here.</p>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Settings;
