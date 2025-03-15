import { useState } from "react";

const SignupBasicInfo = ({ formData, handleChange, nextStep }) => {
  const [error, setError] = useState("");

  const validateAndNext = () => {
    const { name, email, password, mobileNumber } = formData;
    if (!name || !email || !password || !mobileNumber) {
      setError("All fields are required!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long!");
      return;
    }
    setError("");
    nextStep();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">Basic Information</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className="input-field" />
      <input type="email" placeholder="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className="input-field" />
      <input type="password" placeholder="Password" value={formData.password} onChange={(e) => handleChange("password", e.target.value)} className="input-field" />
      <input type="text" placeholder="Mobile Number" value={formData.mobileNumber} onChange={(e) => handleChange("mobileNumber", e.target.value)} className="input-field" />
      <button onClick={validateAndNext} className="btn-primary">Next</button>
    </div>
  );
};

export default SignupBasicInfo;
