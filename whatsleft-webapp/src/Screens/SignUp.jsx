import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Components/Assets/logo5.png"; // Replace with actual path

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 4) {
      setError("You must upload at least 4 profile pictures.");
      return;
    }
    setFormData({ ...formData, profileImage: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    setError(null);
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData((prev) => ({ ...prev, [name]: selectedValues }));
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password) {
        setError("All fields are required in Basic Info.");
        return false;
      }
    }
    if (step === 2 && formData.profileImage.length < 4) {
      setError("You must upload at least 4 profile pictures.");
      return false;
    }
    if (step === 3) {
      if (!formData.age || !formData.location || !formData.qualification || !formData.occupation) {
        setError("All fields are required in Personal Details.");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.relationshipPreference || !formData.lookingFor || formData.interests.length === 0 || formData.hobbies.length === 0) {
        setError("All fields are required in Preferences & Interests.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
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
        localStorage.setItem("token", response.data.token);
        navigate("/homePage");
      } else {
        setError(response.data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  
    setLoading(false);
  };
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <form className="p-8 rounded-lg bg-white shadow-lg w-[500px] h-[550px] flex flex-col space-y-4" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="w-20 mx-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {["Basic Info", "Profile Pictures", "Personal Details", "Preferences & Interests"][step - 1]}
        </h2>

        {error && <p className="text-[#b25776] text-sm text-center">{error}</p>}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </>
        )}

        {/* Step 2: Profile Pictures */}
        {step === 2 && (
          <>
            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full p-3 border rounded-lg" />
            <div className="flex space-x-2">{previewImages.map((src, index) => (<img key={index} src={src} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />))}</div>
          </>
        )}

        {/* Step 3: Personal Details */}
        {step === 3 && (
          <>
            <input type="date" name="age" value={formData.age} onChange={handleChange}max={new Date().toISOString().split("T")[0]}  className="w-full p-3 border rounded-lg" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="qualification" placeholder="Education" value={formData.qualification} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </>
        )}

         {/* Step 4: Preferences & Interests */}
         {step === 4 && (
          <>
          <textarea
            name="aboutMe"
            placeholder="Tell us about yourself"
            value={formData.aboutMe}
            onChange={handleChange}
            className="w-full h-[50px] p-3 border rounded-lg"
            required
          />

            <select
              name="relationshipPreference"
              value={formData.relationshipPreference}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Relationship Preference</option>
              <option value="Monogamy">Monogamy</option>
              <option value="Polygamy">Polygamy</option>
              <option value="Open to Explore">Open to Explore</option>
              <option value="Ethical Non-Monogamy">Ethical Non-Monogamy</option>
            </select>

            <select
              name="lookingFor"
              value={formData.lookingFor}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Looking For</option>
              <option value="Long-term">Long-term</option>
              <option value="Short-term">Short-term</option>
              <option value="New Friends">New Friends</option>
              <option value="Figuring Out">Figuring Out</option>
            </select>

            <select
            multiple
              name="interests"
              value={formData.interests}
              onChange={handleMultiSelectChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Traveling">Traveling</option>
              <option value="Gaming">Gaming</option>
              <option value="Fitness">Fitness</option>
            </select>

            <select
            multiple
              name="hobbies"
              value={formData.hobbies}
              onChange={handleMultiSelectChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="Reading">Reading</option>
              <option value="Cooking">Cooking</option>
              <option value="Dancing">Dancing</option>
              <option value="Painting">Painting</option>
              <option value="Photography">Photography</option>
            </select>
            
          </>
        )}

        <div className="flex justify-between">
          {step > 1 && <button type="button" onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>}
          {step < 4 ? <button type="button" onClick={nextStep} className="bg-[#b25776] text-white px-4 py-2 rounded-lg">Next</button> : <button type="submit" className="bg-[#b25776] text-white px-4 py-2 rounded-lg">{loading ? "Submitting..." : "Submit"}</button>}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
