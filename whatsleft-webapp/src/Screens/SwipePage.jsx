import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { likeUser, dislikeUser } from "../store/matchSlice";
import { FaHeart, FaTimes } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const SwipePage = () => {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
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
    } else {
      alert("No more profiles to swipe!");
    }
  };

  if (loading) return <h2 className="text-xl font-bold text-center mt-10">Loading...</h2>;

  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full overflow-y-auto">
      <h1 className="text-white text-2xl mb-5 mt-5">Swipe Page</h1>
      {users[index] ? (
        <div className="w-[400px] bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Image Swiper */}
          <Swiper spaceBetween={10} slidesPerView={1} className="h-[70vh]">
            {users[index].profilePictures?.length > 0 ? (
              users[index].profilePictures.map((pic, i) => (
                <SwiperSlide key={i}>
                  <img
                    src={`http://localhost:5050/${pic.replace(/\\/g, "/")}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.src = "/default-avatar.jpg")}
                  />
                </SwiperSlide>
              ))
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-300 text-gray-500">
                No Images Available
              </div>
            )}
          </Swiper>

          {/* Name & Age */}
          <div className="text-center bg-black text-white text-lg font-bold py-2">
            {users[index].name}, {users[index].age ? new Date().getFullYear() - new Date(users[index].age).getFullYear() : "N/A"}
          </div>

          {/* Scrollable Additional Details */}
          <div className="p-4 bg-white">
            <h3 className="text-lg font-bold">About Me</h3>
            <p className="text-gray-700">{users[index].aboutMe || "No description provided."}</p>
            <h3 className="text-lg font-bold mt-3">Occupation</h3>
            <p className="text-gray-500">{users[index].occupation || "Not specified"}</p>
            <h3 className="text-lg font-bold mt-3">Relationship Preference</h3>
            <p className="text-gray-500">{users[index].relationshipPreference || "Not specified"}</p>
            <h3 className="text-lg font-bold mt-3">Looking For</h3>
            <p className="text-gray-500">{users[index].lookingFor || "Not specified"}</p>
            <h3 className="text-lg font-bold mt-3">Interests</h3>
            <p className="text-gray-500">{users[index]?.interests?.length ? users[index].interests.join(", ") : "Not specified"}</p>
            <h3 className="text-lg font-bold mt-3">Hobbies</h3>
            <p className="text-gray-500">{users[index]?.hobbies?.length ? users[index].hobbies.join(", ") : "Not specified"}</p>
          </div>
        </div>
      ) : (
        <h3 className="text-xl font-bold mt-6 text-white">No Profiles in Your Area</h3>
      )}

      {/* Swipe Buttons */}
      <div className="flex space-x-8 mt-4 mb-10">
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
