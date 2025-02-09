import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../Components/Assets/logo5.png"; // Replace with actual logo path

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  const [previewImages, setPreviewImages] = useState([]); // To show uploaded images
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload (Profile Pictures)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 4) {
      setError("You must upload at least 4 profile pictures.");
      return;
    }
    setFormData({ ...formData, profilePics: files });
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Handle multi-select dropdowns
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData({ ...formData, [name]: selectedValues });
  };

  // Validate current step before moving forward
  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.mobileNumber || !formData.password) {
        setError("All fields are required.");
        return false;
      }
    }
    if (step === 2) {
      if (formData.profilePics.length < 4) {
        setError("You must upload at least 4 profile pictures.");
        return false;
      }
    }
    if (step === 3) {
      if (!formData.age || !formData.location || !formData.qualification || !formData.occupation) {
        setError("All fields are required.");
        return false;
      }
    }
    if (step === 4) {
      if (!formData.relationshipPreference || !formData.lookingFor || formData.interests.length === 0 || formData.hobbies.length === 0) {
        setError("All fields are required.");
        return false;
      }
    }
    setError(null);
    return true;
  };

  // Move to the next step
  const nextStep = () => {
    if (validateStep()) setStep(step + 1);
  };

  // Move to the previous step
  const prevStep = () => {
    setStep(step - 1);
  };

  // Handle form submission
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

      // Include JWT token in the request
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5050/Authentication/signUp",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Registration Successful!");
        navigate("/homePage");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-transparent">
      <form className="p-8 rounded-lg bg-white shadow-lg w-[500px] flex flex-col space-y-4">
        <img src={logo} alt="Logo" className="w-20 mx-auto" /> {/* Logo */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {step === 1 ? "Basic Information" : step === 2 ? "Profile Pictures" : step === 3 ? "Personal Details" : "Preferences & Interests"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 && (
          <>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            <input type="text" name="mobileNumber" placeholder="Mobile Number" value={formData.mobileNumber} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          </>
        )}

        {step === 2 && (
          <>
            <input type="file" name="profilePics" multiple accept="image/*" onChange={handleFileChange} className="w-full p-3 border rounded-xl" required />
            <p className="text-gray-500 text-sm">Upload at least 4 pictures.</p>
            <div className="grid grid-cols-2 gap-2">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover rounded-md" />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <input type="date" name="age" value={formData.age} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
            <select name="qualification" value={formData.qualification} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="">Select Qualification</option>
              <option value="Graduate">Graduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="PhD">PhD</option>
            </select>
            <input type="text" name="occupation" placeholder="Occupation" value={formData.occupation} onChange={handleChange} className="w-full p-3 border rounded-xl" required />
          </>
        )}
        {step === 4 && (
          <>
            <select name="relationshipPreference" value={formData.relationshipPreference} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="">Select Relationship Preference</option>
              <option value="Monogamy">Monogamy</option>
              <option value="Polygamy">Polygamy</option>
              <option value="Open to Explore">Open to Explore</option>
              <option value="Ethical Non-Monogamy">Ethical Non-Monogamy</option>
            </select>

            <select name="lookingFor" value={formData.lookingFor} onChange={handleChange} className="w-full p-3 border rounded-xl">
              <option value="">Select What You're Looking For</option>
              <option value="Long-term">Long-term</option>
              <option value="Short-term">Short-term</option>
              <option value="New Friends">New Friends</option>
              <option value="Figuring Out">Figuring Out</option>
            </select>

            <label className="text-gray-600">Interests</label>
            <select name="interests" multiple onChange={handleMultiSelectChange} className="w-full p-3 border rounded-xl">
              <option value="Music">Music</option>
              <option value="Traveling">Traveling</option>
              <option value="Sports">Sports</option>
              <option value="Reading">Reading</option>
              <option value="Gaming">Gaming</option>
            </select>

            <label className="text-gray-600">Hobbies</label>
            <select name="hobbies" multiple onChange={handleMultiSelectChange} className="w-full p-3 border rounded-xl">
              <option value="Painting">Painting</option>
              <option value="Dancing">Dancing</option>
              <option value="Cooking">Cooking</option>
              <option value="Photography">Photography</option>
              <option value="Cycling">Cycling</option>
            </select>
          </>
        )}


        <div className="flex justify-between">
          {step > 1 && <button type="button" onClick={prevStep} className="bg-gray-400 text-white px-4 py-2 rounded-xl">Back</button>}
          {step < 4 ? <button type="button" onClick={nextStep} className="bg-blue-500 text-white px-4 py-2 rounded-xl">Next</button> : <button type="submit" onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded-xl">{loading ? "Submitting..." : "Submit"}</button>}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
