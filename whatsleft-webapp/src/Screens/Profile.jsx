import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaUser,
  FaMapMarkerAlt,
  FaRunning,
  FaMusic,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5050/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleNextImage = () => {
    if (user?.profilePictures?.length > 1 && currentImageIndex < user.profilePictures.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };
  const fixImageUrl = (url) => {
    if (!url) return "/default-avatar.jpg";
    return url.replace(/(http:\/\/localhost:5050\/)+/, "http://localhost:5050/");
  };
  
  if (loading) return <h2 className="text-xl font-bold text-center mt-10">Loading...</h2>;

  return (
    <div className="flex flex-col items-center bg-gray-900 h-screen w-full overflow-hidden relative">
      <div className="w-[450px] bg-transparent mt-5 shadow-xl rounded-lg flex flex-col h-[85vh] overflow-y-auto scrollbar-hide">
        <div
          className="relative h-[95%]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
  src={fixImageUrl(user?.profilePictures?.[currentImageIndex])}
  alt="Profile"
  className="w-full h-[560px] object-cover rounded-lg"
/>


          {user?.profilePictures?.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full"
                >
                  <FaChevronLeft className="text-white text-2xl" />
                </button>
              )}
              {hovered && currentImageIndex < user.profilePictures.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full"
                >
                  <FaChevronRight className="text-white text-2xl" />
                </button>
              )}
            </>
          )}
        </div>

        <div className="p-4 bg-black space-y-4 text-white">
          <h1 className="text-3xl">{user?.name}</h1>
          <h3 className="text-2xl">{user?.age ? new Date().getFullYear() - new Date(user.age).getFullYear() : "N/A"} years old</h3>
          <div className="bg-gray-800 p-3 rounded-lg">
          <h3 className="text-lg font-bold capitalize ">About Me</h3>
          <p>{user?.aboutMe || "No description available."}</p>
          </div>


          {["occupation", "location", "qualification", "lookingFor", "relationshipPreference", "height", "zodiacSign", "sexualOrientation", "gender"].map(
            (field, idx) =>
              user?.[field] && (
                <div key={idx} className="bg-gray-800 p-3 rounded-lg">
                  <h3 className="text-lg font-bold capitalize ">{field.replace(/([A-Z])/g, " $1")}</h3>
                  <p>{user[field]}</p>
                </div>
              )
          )}

          {user?.hobbies?.length > 0 && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-lg font-bold">Hobbies</h3>
              <div className="flex flex-wrap gap-2">
                {user.hobbies.map((hobby, i) => (
                  <span key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">{hobby}</span>
                ))}
              </div>
            </div>
          )}

          {user?.interests?.length > 0 && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <h3 className="text-lg font-bold">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, i) => (
                  <span key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">{interest}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-5">
        <Link to="/homePage/profile/editProfile" className="bg-[#b25776] p-4 rounded-full shadow-lg flex items-center space-x-2 text-white text-lg">
          <FaEdit /> <span>Edit Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
