import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Components/Assets/logo5.png"; // Replace with actual path
import { FaPlus, FaTrash } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    profileImage: [],
    age: "",
    location: "",
    qualification: "",
    occupation: "",
    relationshipPreference: "",
    lookingFor: "",
    interests: [],
    hobbies: [],
    aboutMe: "",
  });

  const [previewImages, setPreviewImages] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files); // Get selected files
    if (formData.profileImage.length + selectedFiles.length > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }
  
    setFormData((prevData) => ({
      ...prevData,
      profileImage: [...prevData.profileImage, ...selectedFiles], // Append new files
    }));
  
    setPreviewImages((prevImages) => [
      ...prevImages,
      ...selectedFiles.map((file) => URL.createObjectURL(file)), // Generate preview URLs
    ]);
  
    setError(null); // Clear any errors
  };
  

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData((prev) => ({ ...prev, [name]: selectedValues }));
  };

  const handleSelection = (key, option) => {
    setFormData((prev) => ({ ...prev, [key]: option }));
  };

  const handleMultiSelectToggle = (key, option) => {
    setFormData((prev) => {
      const updatedArray = prev[key].includes(option)
        ? prev[key].filter((item) => item !== option)
        : [...prev[key], option];
      return { ...prev, [key]: updatedArray };
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(password);
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
        setError("Please enter a valid email address.");
        return false;
      }
      if (!formData.mobileNumber.match(/^\d{10}$/)) {
        setError("Please enter a valid 10-digit mobile number.");
        return false;
      }
      if (!validatePassword(formData.password)) {
        setError("Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.");
        return false;
      }
    }
    if (step === 2 && formData.profileImage.length < 4) {
      setError("You must upload at least 4 profile pictures.");
      return false;
    }
    if (step === 3 && (!formData.age || !formData.location || !formData.qualification || !formData.occupation)) {
      setError("All fields are required in Personal Details.");
      return false;
    }
    if (step === 4 && (!formData.relationshipPreference || !formData.lookingFor || formData.interests.length === 0 || formData.hobbies.length === 0)) {
      setError("All fields are required in Preferences & Interests.");
      return false;
    }
    setError(null);
    return true;
  };
  
  

  const nextStep = () => {
    if (validateStep()) {
      if (step === 4) {
        setIsModalOpen(true); // Open modal when reaching step 4
      } else {
        setStep(step + 1);
      }
    }
  };

  const prevStep = () => {
    if (step === 4) {
      setIsModalOpen(false);
      setStep(3);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      
      const data = new FormData();

      // Append images
      formData.profileImage.forEach((file) => {
        data.append("profileImage", file); 
      });

      // Append other fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "profileImage") {
          data.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
        }
      });
  
      const response = await axios.post(
        "http://localhost:5050/Authentication/signUp",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
  
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        navigate("/homePage");
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  
    setLoading(false);
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      profilePictures: [...prev.profilePictures, ...files.map((file) => URL.createObjectURL(file))],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedPictures = [...prev.profilePictures];
      updatedPictures[index] = null; // Remove image by setting it to null
  
      return { ...prev, profilePictures: updatedPictures };
    });
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent -mt-5">
      <form className="p-8 rounded-lg bg-white shadow-lg w-[500px] h-auto flex flex-col space-y-4" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="w-20 mx-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {["Basic Info", "Profile Pictures", "Personal Details", "Preferences & Interests"][step - 1]}
        </h2>

        {error && <p className="text-[#b25776] text-sm text-center">{error}</p>}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
            <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
          </>
        )}

        {/* Step 2: Profile Pictures */}
        {step === 2 && (
          <>
            {/* Profile Pictures */}
            <div className="grid gap-x-10 gap-y-2 grid-cols-4 mb-6">
  {[...Array(8)].map((_, index) => (
    <div key={index} className="relative w-[100px] h-[150px] rounded-xl bg-white -ml-4">
      {previewImages[index] ? (
        <>
          <img
            src={previewImages[index]}
            alt="Profile"
            className="w-full h-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => handleRemoveImage(index)}
            className="absolute top-0 right-0 bg-gradient-to-r from-[#c64d76] via-[#c64d76] to-black text-white p-1 rounded-full"
          >
            <FaTrash size={12} />
          </button>
        </>
      ) : (
        <>
          <input
            type="file"
            id={`fileInput-${index}`}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
          <label htmlFor={`fileInput-${index}`} className="w-full h-full flex items-center justify-center cursor-pointer bg-gray-900 rounded-lg">
            <FaPlus size={20} className="bg-gradient-to-r from-[#c64d76] via-[#c64d76] to-black rounded-xl" color={"white"}/>
          </label>
        </>
      )}
    </div>
  ))}
</div>


          </>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <>
            <input type="date" name="age" value={formData.age} onChange={handleChange} max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]} className="w-full p-3 border-2 border-[#b25776] rounded-lg " required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
            <input type="text" name="qualification" placeholder="Education" value={formData.qualification} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
            <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full p-3 border-2 border-[#b25776] rounded-lg" required />
          </>
        )}

         {/* Step 4: Preferences & Interests */}
         {step === 4 && (
          <>
          <textarea
              name="aboutMe"
              placeholder="Tell us about yourself"
              value={formData.aboutMe}
              onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
              className="w-full h-[80px] p-3 border-2 border-[#b25776] rounded-lg"
              required
            />

            {[{ key: "relationshipPreference", label: "Relationship Preference", options: ["Monogamy", "Polygamy", "Open to Explore", "Ethical Non-Monogamy"] },
              { key: "lookingFor", label: "Looking For", options: ["Long-term", "Short-term", "New Friends", "Figuring Out"] }].map(({ key, label, options }) => (
              <div key={key}>
                <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
                <div className="flex flex-wrap gap-2 mt-1 ">
                  {options.map((option) => (
                    <div
                      key={option}
                      className={`p-2 rounded-lg cursor-pointer bg-gray-700 ${formData[key] === option ? "bg-gradient-to-r from-[#b25776] via-pink-60/50 to-black" : ""}`}
                      onClick={() => handleSelection(key, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {[{ key: "interests", label: "Interests", options: ["Music", "Sports", "Traveling", "Gaming", "Fitness"] },
              { key: "hobbies", label: "Hobbies", options: ["Reading", "Cooking", "Dancing", "Painting", "Photography"] }].map(({ key, label, options }) => (
              <div key={key}>
                <h3 className="text-lg font-semibold text-gray-700">{label}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {options.map((option) => (
                    <div
                      key={option}
                      className={`p-2 rounded-lg cursor-pointer bg-gray-700 ${formData[key].includes(option) ? "bg-gradient-to-r from-[#b25776] via-pink-60/50 to-black" : ""}`}
                      onClick={() => handleMultiSelectToggle(key, option)}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>}
          {step < 4 ? <button type="button" onClick={nextStep} className="bg-gradient-to-r from-[#c64d76] via-[#c64d76] to-black text-white px-4 py-2 rounded-lg">Next</button> : <button type="submit" className="bg-gradient-to-r from-[#c64d76] via-[#c64d76] to-black text-white px-4 py-2 rounded-lg">{loading ? "Submitting..." : "Submit"}</button>}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
