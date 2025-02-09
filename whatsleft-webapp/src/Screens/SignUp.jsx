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
    profilePics: [],
    age: "",
    location: "",
    qualification: "",
    occupation: "",
    relationshipPreference: "",
    lookingFor: "",
    interests: [],
    hobbies: [],
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
    setFormData({ ...formData, profilePics: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setFormData({ ...formData, [name]: selectedValues });
  };

  const validateStep = () => {
    if (step === 1 && (!formData.name || !formData.email || !formData.mobileNumber || !formData.password)) {
      setError("All fields are required.");
      return false;
    }
    if (step === 2 && formData.profilePics.length < 4) {
      setError("You must upload at least 4 profile pictures.");
      return false;
    }
    if (step === 3 && (!formData.age || !formData.location || !formData.qualification || !formData.occupation)) {
      setError("All fields are required.");
      return false;
    }
    if (step === 4 && (!formData.relationshipPreference || !formData.lookingFor || formData.interests.length === 0 || formData.hobbies.length === 0)) {
      setError("All fields are required.");
      return false;
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
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePics") {
          value.forEach((file) => data.append("profilePics", file));
        } else if (Array.isArray(value)) {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      });

      const response = await axios.post(
        "http://localhost:5050/Authentication/signUp",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        alert("Registration Successful!");
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="p-8 rounded-lg bg-white shadow-lg w-[500px] flex flex-col space-y-4" onSubmit={handleSubmit}>
        <img src={logo} alt="Logo" className="w-20 mx-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {["Basic Info", "Profile Pictures", "Personal Details", "Preferences & Interests"][step - 1]}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

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
            <input type="date" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
            <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
          </>
        )}

        {/* Step 4: Preferences & Interests */}
        {step === 4 && (
          <>
            <select name="relationshipPreference" value={formData.relationshipPreference} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="">Select Relationship Preference</option>
              <option value="Monogamy">Monogamy</option>
              <option value="Polygamy">Polygamy</option>
            </select>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {step > 1 && <button type="button" onClick={prevStep} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Back</button>}
          {step < 4 ? <button type="button" onClick={nextStep} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Next</button> : <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg">{loading ? "Submitting..." : "Submit"}</button>}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
