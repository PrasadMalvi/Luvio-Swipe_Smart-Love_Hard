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
  FaVenusMars,
  FaPaw,
  FaWineBottle,
  FaDumbbell,
  FaSmoking,
  FaHome,
  FaTransgenderAlt,
  FaRulerVertical,
  FaStar,
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
    <div className="flex flex-col items-center bg-[#111] h-screen w-full overflow-hidden relative -ml-6 -mt-6">
      <div className="w-[450px] bg-transparent mt-5 shadow-xl rounded-lg flex flex-col h-[85vh] overflow-y-auto scrollbar-hide">
        {/* Image Container */}
        <div
          className="h-[95%] relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Image Progress Bar */}
          <div className="absolute top-2 left-4 right-4 flex z-10">
            {users[index]?.profilePictures?.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 bg-white rounded-full ${
                  idx === currentImageIndex ? "bg-gradient-to-r from-[#c64d76] via-[#c64d76]/80 to-gray-900" : ""
                }`}
                style={{ width: `${100 / users[index]?.profilePictures?.length}%`, marginRight: idx < users[index]?.profilePictures?.length - 1 ? '5px' : '0' }} // Dynamic width
              ></div>
            ))}
          </div>
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
          {users[index]?.profilePictures?.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                  onClick={handlePrevImage}
                >
                  <div className="h-[700px] w-[200px]"></div>
                </button>
              )}
              {hovered && currentImageIndex < users[index].profilePictures.length - 1 && (
                
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                  onClick={handleNextImage}
                >
                  <div className="h-[700px] w-[200px]"></div>
                  
                </button>
              )}
            </>
          )}
        </div>

        {/* Name & Age Bar */}
        <div className="text-center bg-gradient-to-t from-black/100 via-black/65 to-transparent text-white text-lg font-bold py-2 pl-3 -mt-[47px] z-30">

          <div className="flex items-center space-x-3 text-white opacity-85">
            <h1 className="text-3xl">{users[index]?.name}</h1>
            <h3 className="text-2xl mt-1.5">
              {users[index]?.age ? new Date().getFullYear() - new Date(users[index].age).getFullYear() : "N/A"}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-white opacity-70 ">
            <FaBriefcase />
            <span>{users[index]?.occupation || "Not specified"}</span>
          </div>
        </div>

        {/* Scrollable Profile Details */}
        <div className="p-4 bg-black space-y-4">
          {[
            { icon: <FaUser />, title: "About Me", value: users[index]?.aboutMe },
            {
              icon: <FaHeart />,
              title: "Relationship Preference",
              value: users[index]?.relationshipPreference,
              styled: true,
            },
            {
              icon: <FaUsers />,
              title: "Looking For",
              value: users[index]?.lookingFor,
              styled: true,
            },
            {
              icon: <FaRunning />,
              title: "Hobbies",
              value: users[index]?.hobbies,
              list: true,
            },
            {
              icon: <FaMusic />,
              title: "Interests",
              value: users[index]?.interests,
              list: true,
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Location",
              value: users[index]?.location,
              styled: true,
            },
            { icon: <FaVenusMars />, title: "Gender", value: users[index]?.gender },
            { icon: <FaStar />, title: "Zodiac Sign", value: users[index]?.zodiacSign },
            { icon: <FaPaw />, title: "Pets", value: users[index]?.pets },
            { icon: <FaWineBottle />, title: "Drinking", value: users[index]?.drinking },
            { icon: <FaDumbbell />, title: "Workout", value: users[index]?.workout },
            { icon: <FaSmoking />, title: "Smoking", value: users[index]?.smoking },
            { icon: <FaHome />, title: "Family Plans", value: users[index]?.familyPlans },
            { icon: <FaTransgenderAlt />, title: "Sexual Orientation", value: users[index]?.sexualOrientation },
            { icon: <FaRulerVertical />, title: "Height", value: users[index]?.height },
          ]
            .filter((detail) => detail.value)
            .map((detail, idx) => (
              <div key={idx} className="p-3 bg-gray-800 rounded-lg text-white space-y-1">
                <div className="flex items-center space-x-3">
                  {detail.icon}
                  <h3 className="text-lg font-bold">{detail.title}</h3>
                </div>
                <span className="block text-white">
                  {detail.styled ? (
                    <div className="bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 text-white text-sm rounded-full px-3 py-1 inline-block">
                      {detail.value}
                    </div>
                  ) : detail.list ? (
                    <div className="flex flex-wrap gap-2">
                      {detail.value.map((item, i) => (
                        <div key={i} className="bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 text-white text-sm rounded-full px-3 py-1">
                          {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    detail.value
                  )}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Fixed Like/Dislike Buttons */}
      <div className="fixed bottom-5 flex space-x-8 z-50">
        <button onClick={() => handleSwipe("dislike")} className="bg-red-500 hover:bg-gradient-to-r from-red-500 via-[#b25776]/50 to-gray-900 p-4 rounded-full shadow-lg">
          <FaTimes className="text-white text-3xl" />
        </button>
        <button onClick={() => handleSwipe("like")} className="bg-[#b25776] p-4 rounded-full shadow-lg hover:bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900">
          <FaHeart className="text-white text-3xl" />
        </button>
      </div>
    </div>
  );
};

export default SwipePage;
