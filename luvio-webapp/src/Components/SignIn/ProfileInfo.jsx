import { useState } from "react";

const SignupProfilePictures = ({ formData, handleChange, nextStep, prevStep }) => {
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 4) {
      setError("Please select at least 4 images.");
      return;
    }
    setError("");
    handleChange("profilePic", files);
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-xl font-bold text-center">Upload Profile Pictures</h2>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="input-field" />
      <div className="flex justify-between">
        <button onClick={prevStep} className="btn-secondary">Back</button>
        <button onClick={nextStep} className="btn-primary">Next</button>
      </div>
    </div>
  );
};

export default SignupProfilePictures;
