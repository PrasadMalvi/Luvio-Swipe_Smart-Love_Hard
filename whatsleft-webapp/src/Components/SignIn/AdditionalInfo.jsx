import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignupAdditionalInfo = ({ formData, handleChange, prevStep }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5050/Authentication/signUp", formData);
      if (response.data.success) {
        localStorage.setItem("authToken", response.data.token);
        alert("Signup Successful!");
        navigate("/homePage");
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">Additional Information</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input type="text" placeholder="Location" value={formData.location} onChange={(e) => handleChange("location", e.target.value)} className="input-field" />
      <input type="text" placeholder="Occupation" value={formData.occupation} onChange={(e) => handleChange("occupation", e.target.value)} className="input-field" />
      <button onClick={prevStep} className="btn-secondary">Back</button>
      <button onClick={handleSubmit} disabled={loading} className="btn-primary">{loading ? "Signing Up..." : "Submit"}</button>
    </div>
  );
};

export default SignupAdditionalInfo;
