import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaArrowUp, FaArrowDown } from "react-icons/fa";

const EditProfile = () => {
  const [user, setUser] = useState({
    profilePictures: [],
    aboutMe: "",
    occupation: "",
    lookingFor: "",
    relationshipPreference: "",
    hobbies: [],
    interests: [],
    height: "",
    zodiacSign: "",
    lifestyle: {
      familyPlans: "",
      pets: "",
      drinking: "",
      smoking: "",
      workout: "",
      sleepingHabits: "",
    },
    sexualOrientation: "",
    gender: "",
  });

  const options = {
    lookingFor: ["Long-term", "Short-term", "Friends", "Figuring Out"],
    relationshipPreference: ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"],
    height: Array.from({ length: 35 }, (_, i) => `${4 + Math.floor(i / 12)}'${i % 12}"`),
    zodiacSign: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"],
    sexualOrientation: ["Straight", "Gay", "Bisexual", "Asexual", "Pansexual", "Queer"],
    gender: ["Male", "Female", "Non-binary", "Transgender", "Other"],
    lifestyle: {
      familyPlans: ["Want Kids", "Don't Want Kids", "Not Sure"],
      pets: ["Dog", "Cat", "Other", "None"],
      drinking: ["Never", "Occasionally", "Regularly"],
      smoking: ["Never", "Occasionally", "Regularly"],
      workout: ["Never", "Occasionally", "Regularly"],
      sleepingHabits: ["Early Bird", "Night Owl", "Flexible"],
    },
    hobbies: ["Reading", "Traveling", "Cooking", "Music", "Gaming", "Sports", "Dancing"],
    interests: ["Technology", "Fashion", "Fitness", "Movies", "Photography", "Art", "Food"],
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:5050/Authentication/getUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.user) {
          setUser((prevUser) => ({
            ...prevUser,
            ...res.data.user,
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const toggleSelection = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

      {/* Profile Pictures */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {user.profilePictures.map((pic, index) => (
          <div key={index} className="relative w-24 h-24">
            <img src={pic} alt="Profile" className="w-full h-full object-cover rounded-lg" />
            <button className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
              <FaTrash size={12} />
            </button>
          </div>
        ))}
        {user.profilePictures.length < 10 && (
          <button className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-lg">
            <FaPlus size={24} />
          </button>
        )}
      </div>

      {/* About Me */}
      <label className="block text-sm font-medium mb-1">About Me</label>
      <textarea className="w-full border p-2 rounded-md mb-4" value={user.aboutMe} />

      {/* Selection Fields */}
      {["lookingFor", "relationshipPreference", "height", "zodiacSign", "sexualOrientation", "gender"].map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium mb-1">{field.replace(/([A-Z])/g, " $1").trim()}</label>
          <div className="flex flex-wrap gap-2">
            {options[field].map((option) => (
              <button
                key={option}
                className={`px-3 py-1 rounded-full ${user[field] === option ? "bg-[#b25776] text-white" : "bg-gray-200"}`}
                onClick={() => toggleSelection(field, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Lifestyle Preferences */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Lifestyle</h3>
        {Object.keys(user.lifestyle).map((key) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">{key.replace(/([A-Z])/g, " $1").trim()}</label>
            <div className="flex flex-wrap gap-2">
              {options.lifestyle[key].map((option) => (
                <button
                  key={option}
                  className={`px-3 py-1 rounded-full ${user.lifestyle[key] === option ? "bg-[#b25776] text-white" : "bg-gray-200"}`}
                  onClick={() => setUser((prev) => ({
                    ...prev,
                    lifestyle: { ...prev.lifestyle, [key]: prev.lifestyle[key] === option ? "" : option },
                  }))}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProfile;
