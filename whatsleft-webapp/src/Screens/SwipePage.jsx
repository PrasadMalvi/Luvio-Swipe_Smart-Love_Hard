import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { likeUser, dislikeUser } from "../store/matchSlice";
import {
  FaHeart,
  FaTimes,
  FaBriefcase,
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaRunning,
  FaMusic,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import "swiper/css";
import "tailwind-scrollbar-hide";

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("authToken");
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
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSwipe = (direction) => {
    if (users[index]) {
      direction === "like" ? dispatch(likeUser(users[index])) : dispatch(dislikeUser(users[index]));
    }
    if (index < users.length - 1) {
      setIndex(index + 1);
      setCurrentImageIndex(0); // Reset to first image when swiping next profile
    } else {
      alert("No more profiles to swipe!");
    }
  };

  const handleNextImage = () => {
    if (users[index]?.profilePictures?.length > currentImageIndex + 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) return <h2 className="text-xl font-bold text-center mt-10">Loading...</h2>;

  return (
    <div className="flex flex-col items-center bg-gray-900 h-screen w-full overflow-hidden relative -ml-6 -mt-6">
      <div className="w-[450px] bg-transparent mt-5 shadow-xl rounded-lg flex flex-col h-[85vh] overflow-y-auto scrollbar-hide">
        {/* Image Container */}
        <div
          className="h-[95%] relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {users[index]?.profilePictures?.length > 0 ? (
            <img
              src={`http://localhost:5050/${users[index].profilePictures[currentImageIndex].replace(/\\/g, "/")}`}
              alt="Profile"
              className="w-full h-[660px] object-cover"
              onError={(e) => (e.target.src = "/default-avatar.jpg")}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-300 text-gray-500">
              No Images Available
            </div>
          )}
          {/* Image Navigation Buttons */}
          {users[index]?.profilePictures?.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white"
                  onClick={handlePrevImage}
                >
                  <FaArrowLeft />
                </button>
              )}
              {hovered && currentImageIndex < users[index].profilePictures.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 p-2 rounded-full text-white"
                  onClick={handleNextImage}
                >
                  <FaArrowRight />
                </button>
              )}
            </>
          )}
        </div>

        {/* Name & Age Bar */}
        <div className="text-center bg-gradient-to-t from-black/100 via-black/65 to-transparent text-white text-lg font-bold py-2 pl-3 -mt-[47px] z-30">

          <div className="flex items-center space-x-3 text-white opacity-85">
            <h1 className="text-3xl">{users[index]?.name}</h1>
            <h3 className="text-2xl">
              {users[index]?.age ? new Date().getFullYear() - new Date(users[index].age).getFullYear() : "N/A"}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-white opacity-70">
            <FaBriefcase />
            <span>{users[index]?.occupation || "Not specified"}</span>
          </div>
        </div>

        {/* Scrollable Profile Details */}
        <div className="p-4 bg-black space-y-4">
          {[
            { icon: <FaUser />, title: "About Me", value: users[index]?.aboutMe || "No description provided." },
            {
              icon: <FaHeart />,
              title: "Relationship Preference",
              value: (
                <div className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1 inline-block">
                  {users[index]?.relationshipPreference || "Not specified"}
                </div>
              ),
            },
            {
              icon: <FaUsers />,
              title: "Looking For",
              value: (
                <div className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1 inline-block">
                  {users[index]?.lookingFor || "Not specified"}
                </div>
              ),
            },
            {
              icon: <FaRunning />,
              title: "Hobbies",
              value: users[index]?.hobbies?.length ? (
                <div className="flex flex-wrap gap-2">
                  {users[index].hobbies.map((hobby, i) => (
                    <div key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">
                      {hobby}
                    </div>
                  ))}
                </div>
              ) : (
                "Not specified"
              ),
            },
            {
              icon: <FaMusic />,
              title: "Interests",
              value: users[index]?.interests?.length ? (
                <div className="flex flex-wrap gap-2">
                  {users[index].interests.map((interest, i) => (
                    <div key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">
                      {interest}
                    </div>
                  ))}
                </div>
              ) : (
                "Not specified"
              ),
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Location",
              value: (
                <div className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1 inline-block">
                  {users[index]?.location || "Not specified"}
                </div>
              ),
            },
          ].map((detail, idx) => (
            <div key={idx} className="p-3 bg-gray-800 rounded-lg text-[#b25776] space-y-1">
              <div className="flex items-center space-x-3">
                {detail.icon}
                <h3 className="text-lg font-bold">{detail.title}</h3>
              </div>
              <span className="block text-white">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Like/Dislike Buttons */}
      <div className="fixed bottom-5 flex space-x-8 z-50">
        <button onClick={() => handleSwipe("dislike")} className="bg-red-500 p-4 rounded-full shadow-lg">
          <FaTimes className="text-white text-3xl" />
        </button>
        <button onClick={() => handleSwipe("like")} className="bg-[#b25776] p-4 rounded-full shadow-lg">
          <FaHeart className="text-white text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default SwipePage;
