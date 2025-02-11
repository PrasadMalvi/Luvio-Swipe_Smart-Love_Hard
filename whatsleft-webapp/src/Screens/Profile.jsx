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
          const profilePictures =
            res.data.user.profilePictures?.length > 0
              ? res.data.user.profilePictures.map((pic) => `http://localhost:5050/${pic}`.replace(/\\/g, "/"))
              : ["https://via.placeholder.com/200"]; // Default image if no profile pictures

          setUser({
            name: res.data.user.name,
            age: res.data.user.age ? new Date().getFullYear() - new Date(res.data.user.age).getFullYear() : "N/A",
            occupation: res.data.user.occupation || "Not specified",
            location: res.data.user.location || "Not specified",
            hobbies: res.data.user.hobbies || [],
            interests: res.data.user.interests || [],
            profilePictures, // Store multiple pictures
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle Next and Previous Image in Carousel
  const handleNextImage = () => {
    if (currentImageIndex < user.profilePictures.length - 1) {
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
        
        {/* Profile Picture Carousel */}
        <div
          className="relative h-[95%]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={user.profilePictures[currentImageIndex]}
            alt="Profile"
            className="w-full h-[660px] object-cover rounded-lg"
            onError={(e) => (e.target.src = "/default-avatar.jpg")}
          />

          {/* Image Navigation Buttons */}
          {user.profilePictures.length > 1 && (
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

        {/* Profile Info */}
        <div className="text-center bg-gradient-to-t from-black via-black/50 to-transparent text-white text-lg font-bold py-3 z-30 -mt-12">
          <h1 className="text-3xl text-start  pl-5 ">{user?.name}</h1>
          <h3 className="text-2xl text-start pl-5">{user?.age} years old</h3>
        </div>

        {/* Profile Details */}
        <div className="p-4 bg-black space-y-4">
          {[
            { icon: <FaUser />, title: "About Me", value: "A great person looking for something special." },
            { icon: <FaBriefcase />, title: "Occupation", value: user?.occupation },
            { icon: <FaMapMarkerAlt />, title: "Location", value: user?.location },
            {
              icon: <FaRunning />,
              title: "Hobbies",
              value: user?.hobbies.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.hobbies.map((hobby, i) => (
                    <div key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">{hobby}</div>
                  ))}
                </div>
              ) : (
                "Not specified"
              ),
            },
            {
              icon: <FaMusic />,
              title: "Interests",
              value: user?.interests.length ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest, i) => (
                    <div key={i} className="bg-[#b25776] text-white text-sm rounded-full px-3 py-1">{interest}</div>
                  ))}
                </div>
              ) : (
                "Not specified"
              ),
            },
          ].map((detail, idx) => (
            <div key={idx} className="p-3 bg-gray-800 rounded-lg text-[#b25776] space-y-1">
              <div className="flex items-center space-x-3">{detail.icon} <h3 className="text-lg font-bold">{detail.title}</h3></div>
              <span className="block text-white">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Button */}
      <div className="fixed bottom-5">
        <button className="bg-blue-500 p-4 rounded-full shadow-lg flex items-center space-x-2 text-white text-lg">
          <FaEdit /> <span>Edit Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;
