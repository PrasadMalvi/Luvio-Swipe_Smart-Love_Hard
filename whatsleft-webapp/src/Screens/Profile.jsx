import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBriefcase,
  FaUser,
  FaMapMarkerAlt,
  FaRunning,
  FaMusic,
  FaEdit,
  FaTransgenderAlt,
  FaVenusMars,
  FaRulerVertical,
  FaStar,
  FaPaw,
  FaWineBottle,
  FaDumbbell,
  FaSmoking,
  FaHome,
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
    if (!url.startsWith("http")) {
      return `http://localhost:5050/${url}`; // Ensure correct absolute URL
    }
    return url;
  };
  
  
  const getIcon = (field) => {
    switch (field) {
      case "occupation":
        return <FaBriefcase />;
      case "location":
        return <FaMapMarkerAlt />;
      case "qualification":
        return <FaUser />;
      case "lookingFor":
        return <FaStar />;
      case "relationshipPreference":
        return <FaVenusMars />;
      case "height":
        return <FaRulerVertical />;
      case "zodiacSign":
        return <FaStar />;
      case "sexualOrientation":
        return <FaTransgenderAlt />;
      case "gender":
        return <FaVenusMars />;
      case "familyPlans":
        return <FaHome />;
      case "pets":
        return <FaPaw />;
      case "drinking":
        return <FaWineBottle />;
      case "smoking":
        return <FaSmoking />;
      case "workout":
        return <FaDumbbell />;
      case "sleepingHabits":
        return <FaHome />;
      case "hobbies":
        return <FaRunning />;
      case "interests":
        return <FaMusic />;
      default:
        return null;
    }
  };

  if (loading) return <h2 className="text-xl font-bold text-center mt-10">Loading...</h2>;

  return (
    <div className="flex flex-col items-center bg-gray-900 h-screen w-screen/3 overflow-hidden relative -ml-6 -mt-7 -mr-6">
      <div className="w-[500px] bg-transparent mt-5 shadow-xl rounded-lg flex flex-col h-[85vh] overflow-y-auto scrollbar-hide">
      <div
          className="relative h-[95%]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="absolute top-2 left-4 right-4 flex z-10">
            {user?.profilePictures?.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 bg-white rounded-full ${
                  idx === currentImageIndex ? "bg-gradient-to-r from-[#c64d76] via-[#c64d76]/80 to-gray-900" : ""
                }`}
                style={{ width: `${100 / user?.profilePictures?.length}%`, marginRight: idx < user?.profilePictures?.length - 1 ? '5px' : '0' }} // Dynamic width
              ></div>
            ))}
          </div>

          <img
          src={fixImageUrl(user?.profilePictures?.[currentImageIndex])}
          alt="Profile"
          className="w-full h-[660px] object-cover rounded-lg -mt-10"
        />


          {user?.profilePictures?.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-transparent"
                  onClick={handlePrevImage}
                >
                  <div className="h-[700px] w-[200px]"></div>
                </button>
              )}
              {hovered && currentImageIndex < user.profilePictures.length - 1 && (
                
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
        <div className="text-center bg-gradient-to-t from-black/100 via-black/65 to-transparent text-white text-lg font-bold py-2 pl-3 -mt-[47px] z-30">
          <div className="flex items-center space-x-3 text-white opacity-85">
            <h1 className="text-3xl">{user?.name}</h1>
            <h3 className="text-2xl mt-1.5">
              {user?.age ? new Date().getFullYear() - new Date(user.age).getFullYear() : "N/A"}
            </h3>
          </div>
          <div className="flex items-center space-x-3 text-white opacity-70 ">
            <FaBriefcase />
            <span>{user?.occupation || "Not specified"}</span>
          </div>
        </div>


        <div className="p-4 bg-black space-y-4 text-white -mt-1" >
         

          {/* About Me */}
          <div className="bg-gray-800 p-3 rounded-lg flex items-start">
  <div className="mr-2 mt-1">
    <FaUser /> {/* Or your "About Me" specific logo */}
  </div>
  <div>
    <h3 className="text-lg font-bold capitalize">About Me</h3>
    <p className=" -ml-6">{user.aboutMe}</p>
  </div>
</div>

          {/* Dynamic Fields */}
          {[
            "occupation",
            "location",
            "qualification",
            "lookingFor",
            "relationshipPreference",
            "height",
            "zodiacSign",
            "sexualOrientation",
            "gender",
            "familyPlans",
            "pets",
            "drinking",
            "smoking",
            "workout",
            "sleepingHabits",
          ]
            .filter((field) => user?.[field])
            .map((field, idx) => (
              <div key={idx} className="bg-gray-800 p-3 rounded-lg flex items-start">
                <div className="mr-2 mt-1">{getIcon(field)}</div>
                <div>
                  <h3 className="text-lg font-bold capitalize ">
                    {field.replace(/([A-Z])/g, " $1")}
                  </h3>
                  <div className="bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 text-white text-sm rounded-full px-3 py-1 inline-block -ml-6">
                    {user[field]}
                  </div>
                </div>
              </div>
            ))}

          {/* Hobbies */}
          {user?.hobbies?.length > 0 && (
            <div className="bg-gray-800 p-3 rounded-lg flex items-start">
              <div className="mr-2">{getIcon("hobbies")}</div>
              <div>
                <h3 className="text-lg font-bold">Hobbies</h3>
                <div className="flex flex-wrap gap-2 -ml-6">
                  {user.hobbies.map((hobby, i) => (
                    <span key={i} className="bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 text-white text-sm rounded-full px-3 py-1 ">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Interests */}
          {user?.interests?.length > 0 && (
            <div className="bg-gray-800 p-3 rounded-lg flex items-start">
              <div className="mr-2">{getIcon("interests")}</div>
              <div>
                <h3 className="text-lg font-bold">Interests</h3>
                <div className="flex flex-wrap gap-2 -ml-6">
                  {user.interests.map((interest, i) => (
                    <span key={i} className="bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 text-white text-sm rounded-full px-3 py-1 ">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-5">
        <Link
          to="/homePage/profile/editProfile"
          className="bg-[#b25776] hover:bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-gray-900 p-4 rounded-full shadow-lg flex items-center space-x-2 text-white text-lg"
        >
          <FaEdit /> <span>Edit Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Profile;