import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
    const navigate = useNavigate();
  const [user, setUser] = useState({
    profilePictures: [],
    aboutMe: "",
    lookingFor: "",
    relationshipPreference: "",
    height: "",
    location: "",
    qualification: "",
    occupation: "",
    basics: {
      zodiacSign: "",
      sexualOrientation: "",
      familyPlans: "",
    },
    lifestyle: {
      pets: "",
      drinking: "",
      smoking: "",
      workout: "",
      sleepingHabits: "",
    },
    hobbies: [],
    interests: [],
  });

  const [modalOpen, setModalOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [originalUser, setOriginalUser] = useState(null);

  const options = {
    LookingFor: ["Long-term", "Short-term", "Friends", "Figuring Out"],
    RelationshipPreference: ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"],
    Height: Array.from({ length: 35 }, (_, i) => `${4 + Math.floor(i / 12)}'${i % 12}"`),
    Location: "",
    Occupation: "",
    qalification: "",
    Basics: {
      ZodiacSign: ["Aries", "Taurus", "Gemini", "Cancer", "Leo"],
      SexualOrientation: ["Straight", "Gay", "Bisexual", "Asexual", "Pansexual"],
      FamilyPlans: ["Want Kids", "Don't Want Kids", "Not Sure"],
    },
    Lifestyle: {
      Pets: ["Dog", "Cat", "Other", "None"],
      Drinking: ["Never", "Occasionally", "Regularly"],
      Smoking: ["Never", "Occasionally", "Regularly"],
      Workout: ["Never", "Occasionally", "Regularly"],
      SleepingHabits: ["Early Bird", "Night Owl", "Flexible"],
    },
    Hobbies: ["Reading", "Traveling", "Cooking", "Gaming"],
    Interests: ["Technology", "Fitness", "Movies", "Photography"],
  };

  useEffect(() => {
    const fetchUser = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const res = await axios.get("http://localhost:5050/Authentication/getUser", {
            headers: { Authorization: `Bearer ${token}` },
          });
      
          if (res.data.success && res.data.user) {
            console.log("Fetched user:", res.data.user); // Debugging
      
            const fetchedUser = {
              ...res.data.user,
              profilePictures: res.data.user.profilePictures?.map((pic) =>
                pic.startsWith("http") ? pic : `http://localhost:5050/${pic}`.replace(/\\/g, "/")
              ) || [],
              aboutMe: res.data.user.aboutMe || "",
              hobbies: res.data.user.hobbies || [],
              interests: res.data.user.interests || [],
              occupation: res.data.user.occupation || "",
              location: res.data.user.location || "",
              lookingFor: res.data.user.lookingFor || "",
              relationshipPreference: res.data.user.relationshipPreference || "",
              height: res.data.user.height || "",
              zodiacSign: res.data.user.zodiacSign || "",
              lifestyle: {
                familyPlans: res.data.user.lifestyle?.familyPlans || "",
                pets: res.data.user.lifestyle?.pets || "",
                drinking: res.data.user.lifestyle?.drinking || "",
                smoking: res.data.user.lifestyle?.smoking || "",
                workout: res.data.user.lifestyle?.workout || "",
                sleepingHabits: res.data.user.lifestyle?.sleepingHabits || "",
              },
              sexualOrientation: res.data.user.sexualOrientation || "",
              gender: res.data.user.gender || "",
              qualification: res.data.user.qualification || "",
            };
      
            setUser(fetchedUser);
            setOriginalUser(fetchedUser); // Store original data
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      
    fetchUser();
  }, []);

  const isEdited = () => {
    return JSON.stringify(user) !== JSON.stringify(originalUser);
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.put(
        "http://localhost:5050/Authentication/updateProfile",
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Profile updated successfully", res.data);
      navigate("/homepage/profile")
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };
  

  const toggleModal = (category) => {
    setSelectedCategory(category);
    setModalOpen(modalOpen === category ? null : category);
  };

  const handleSelection = (field, value) => {
    setUser((prev) => ({
      ...prev,
      [field]: value,
    }));
   
  };
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUser((prev) => ({
      ...prev,
      profilePictures: [...prev.profilePictures, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const handleRemoveImage = (index) => {
    setUser((prev) => {
      const updatedPictures = [...prev.profilePictures];
      updatedPictures[index] = null; // Remove image by setting it to null
  
      return { ...prev, profilePictures: updatedPictures };
    });
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 h-screen w-[1110px] overflow-hidden relative -ml-6 -mt-6 pt-5">
    <div className="max-w-2xl mx-auto mb-20 p-6 bg-black rounded-xl shadow-md w-[400px] h-[740px] pt-10 text-white overflow-y-auto scrollbar-hide">
      
    <div className="flex text-center bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-black text-white w-[400px] -ml-6 rounded-t-xl -mt-10 mb-5 h-[50px]">
          <h1 className="text-3xl text-start pl-3 pt-2 ">{user?.name}</h1><h3 className="text-2xl text-start ml-2 mt-1 pt-2">{user?.age ? new Date().getFullYear() - new Date(user.age).getFullYear() : "N/A"}</h3>
        </div>
      {/* Profile Pictures */}
      <div className="grid gap-x-10 gap-y-2 grid-cols-3 mb-6">
          {[...Array(9)].map((_, index) => (
            <div key={index} className="relative w-[123px] h-[180px] rounded-xl  bg-white -ml-4">
              {user.profilePictures[index] ? (
                <>
                  <img
                    src={user.profilePictures[index]}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button onClick={() => handleRemoveImage(index)} className="absolute top-0 right-0 bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-black text-white p-1 rounded-full">
                    <FaTrash size={12} />
                </button>

                </>
              ) : (
                <button className="w-full h-full bg-gray-900 rounded-lg  flex items-center justify-center">
                    <input type="file" multiple onChange={handleImageUpload} className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="cursor-pointer bg-gradient-to-r from-[#c64d76] via-[#b25776]/50 to-black p-2 rounded-3xl"><FaPlus size={12} /></label>
                  
                </button>
              )}
            </div>
          ))}
        </div>
      {/* About Me */}
      <label className="block text-sm font-medium mb-1">About Me</label>
      <textarea
          className="w-full border-2 border-[#b25776] p-2 rounded-md bg-gray-900"
          value={user.aboutMe}
          onChange={(e) => setUser({ ...user, aboutMe: e.target.value })}
        />
      <input
        type="text"
        placeholder="Location"
        className="w-full border-solid border-2 border-[#b25776] p-2 rounded-md mb-4 bg-gray-900"
        value={user.location}
        onChange={(e) => setUser({ ...user, location: e.target.value })}
        />
        <input
        type="text"
        placeholder="Qualification"
        className="w-full border-solid border-2 border-[#b25776] p-2 rounded-md mb-4 bg-gray-900"
        value={user.qualification}
        onChange={(e) => setUser({ ...user, qualification: e.target.value })}
        />
        <input
        type="text"
        placeholder="Occuption"
        className="w-full border-solid border-2 border-[#b25776] p-2 rounded-md mb-4 bg-gray-900"
        value={user.occupation}
        onChange={(e) => setUser({ ...user, occupation: e.target.value })}
        />
      {/* Selectable Fields with Modal */}
      {["LookingFor", "RelationshipPreference", "Height"].map((field) => (
        <div key={field} className="flex justify-between items-center p-3 border-b cursor-pointer hover:text-[#b25776]" onClick={() => toggleModal(field)}>
          <span>{field.replace(/([A-Z])/g, " $1").trim()}</span>
          <FaChevronRight className="hover:text-[#b25776]"/>
        </div>
      ))}
       
      {/* Basics Section */}
      <div className="flex justify-between items-center p-3 border-b cursor-pointer hover:text-[#b25776] " onClick={() => toggleModal("Basics")}>
        <span>Basic</span>
        <FaChevronRight/>
      </div>

      {/* Lifestyle Section */}
      <div className="flex justify-between items-center p-3 border-b cursor-pointer hover:text-[#b25776]" onClick={() => toggleModal("Lifestyle")}>
        <span>Lifestyle</span>
        <FaChevronRight />
      </div>

      {/* Hobbies & Interests */}
      <div className="flex justify-between items-center p-3 border-b cursor-pointer hover:text-[#b25776]" onClick={() => toggleModal("HobbiesAndInterests")}>
        <span>Hobbies & Interests</span>
        <FaChevronRight/>
      </div>

      {/* Bottom Sheet Modal */}
      <div className="h-[200] w-[400px]">
      {modalOpen && (
       <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-800 p-4 rounded-lg shadow-lg w-[400px] max-h-[500px] -ml-8 mb-4 overflow-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-3">
              <button className="text-white fixed text-4xl ml-[340px]" onClick={() => setModalOpen(null)}>×</button>
            </div>
          <div className="grid grid-cols-1 gap-2 ">
          {(selectedCategory === "Basics" ? Object.entries(options.Basics) :
              selectedCategory === "Lifestyle" ? Object.entries(options.Lifestyle) :
              selectedCategory === "HobbiesAndInterests" ? [["Hobbies", options.Hobbies], ["Interests", options.Interests]] :
              [[selectedCategory, options[selectedCategory]]]).map(([key, values]) => (
                <div key={key}>
                  <h4 className="font-semibold mb-2">{key}</h4>
                  <div className="flex flex-wrap gap-2">
                    {values.map((option) => (
                      <div key={option} className={`p-2 rounded-lg cursor-pointer bg-gray-700 ${user[key] === option ? "bg-gradient-to-r from-[#b25776] via-pink-60/50 to-black" : ""}`} onClick={() => handleSelection(key, option)}>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
          
        </motion.div>
      )}
      </div>
      <div className="fixed bottom-5">
          <button
            type="submit"
            onClick={saveProfile}
            disabled={!isEdited()} // Disable when no edits
            className={`p-4 w-[150px] ml-[100px] pl-[55px] rounded-full shadow-lg flex items-center space-x-2 text-white text-xl ${
              isEdited() ? "bg-[#b25776]" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
    </div>
        
    </div>
  );
};

export default EditProfile;
