import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { likeUser, dislikeUser } from "../store/matchSlice";
import { FaHeart, FaTimes } from "react-icons/fa";

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const dispatch = useDispatch();

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get token
        const response = await axios.get("http://localhost:5050/Swipe/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          console.error("Error fetching users:", response.data.message);
        }
      } catch (error) {
        console.error("Fetch users error:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleSwipe = (direction) => {
    if (users[index]) {
      if (direction === "like") {
        dispatch(likeUser(users[index]));
      } else {
        dispatch(dislikeUser(users[index]));
      }
    }
    if (index < users.length - 1) {
      setIndex(index + 1);
    } else {
      alert("No more profiles to swipe!");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Swipe Page</h2>
      {users[index] && (
        <div className="relative w-80 h-96 bg-white shadow-lg rounded-lg overflow-hidden">
          <img
            src={users[index].profilePictures[0] || "https://via.placeholder.com/300"} // Show first picture
            alt="Profile"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 text-white text-xl font-bold">
            {users[index].name}, {users[index].age}
            <p className="text-sm">{users[index].location}</p>
            <p className="text-xs">{users[index].interests.join(", ")}</p>
          </div>
        </div>
      )}

      <div className="flex space-x-8 mt-4">
        <button onClick={() => handleSwipe("dislike")} className="bg-red-500 p-4 rounded-full">
          <FaTimes className="text-white text-3xl" />
        </button>
        <button onClick={() => handleSwipe("like")} className="bg-green-500 p-4 rounded-full">
          <FaHeart className="text-white text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default SwipePage;
