import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(
        "http://localhost:5050/Authentication/signUp",
        formData
      );
    
      console.log("Full Response Data:", response); // Debugging
    
      if (response.data.success) {
        const { token, user } = response.data;
    
        // 🔹 Store token & user details in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
    
        alert("Registration Successful! Logged in.");
        navigate("/homePage");
      } else {
        console.error("Unexpected API Response:", response.data);
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err.response); // Log error response
      setError(err.response?.data?.message || "Something went wrong");
    }
    
  
    setLoading(false);
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="p-10 rounded-lg bg-white shadow-lg w-[500px] flex flex-col space-y-4 mt-20 "
      >
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src={require("../Components/Assets/logo5.png")}
            className="h-[150px] w-auto"
            alt="WhatsLeft-logo"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
          Welcome! Lets get started?
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Input Fields */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-[350px] ml-8 p-3 border rounded-3xl border-[#b25776] pl-5 focus:outline-none focus:ring-2 focus:ring-[#b25776]"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-[350px] ml-8 p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-[350px] ml-8 p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776]"
        />
        <input
          type="text"
          name="mobileNumber"
          placeholder="Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          required
          className="w-[350px] ml-8 p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776]"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-[350px] ml-8 h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl mt-2 hover:bg-[#e887a9] transition duration-300"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
