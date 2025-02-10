import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    mobileNumber: "",
    otp: "",
  });

  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  // ✅ Fix: Prevent navigation infinite loop
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/homePage", { replace: true }); // Prevents reloading issues
    }
  }, []);

  // ✅ Handle input changes properly
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Sign in with Email
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5050/Authentication/signIn", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("authToken", res.data.token); // Save Token
      alert("Sign-in successful! Redirecting...");
      navigate("/homePage", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Send OTP for Mobile Login
  const handleSendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:5050/Authentication/send-otp", {
        mobileNumber: formData.mobileNumber,
      });

      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Verify OTP and Sign In
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:5050/Authentication/verifyOtp", {
        mobileNumber: formData.mobileNumber,
        otp: formData.otp,
      });

      localStorage.setItem("authToken", res.data.token); // Save Token
      navigate("/homePage", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${require("../Components/Assets/home-bg1.jpg")})`,
        }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Form Wrapper */}
      <div className="relative flex flex-col items-center justify-center h-full bg-black bg-opacity-60">
        
        {/* Form Card */}
        <div className="bg-white bg-opacity-90 p-10 rounded-lg shadow-lg w-[500px]">
          <img
            src={require("../Components/Assets/logo5.png")}
            className="h-[150px] w-auto mb-6 ml-20"
            alt="Logo"
          />
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Welcome! Log in to find your match.
          </h2>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Selection Buttons */}
          {!method && (
            <div className="flex flex-col items-center space-y-4 w-[300px] ml-12 mb-10">
              <button
                type="button"
                onClick={() => setMethod("email")}
                className="w-full h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl hover:bg-[#e887a9] transition duration-300"
              >
                Continue with Email
              </button>

              <div className="flex items-center w-full my-4">
                <div className="flex-grow border-t border-gray-400"></div>
                <span className="px-3 text-gray-600">or</span>
                <div className="flex-grow border-t border-gray-400"></div>
              </div>

              <button
                type="button"
                onClick={() => setMethod("mobile")}
                className="w-full h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl hover:bg-[#e887a9] transition duration-300"
              >
                Log in with Mobile OTP
              </button>
            </div>
          )}

          {/* Email Login Form */}
          {method === "email" && (
            <form onSubmit={handleEmailSignIn} className="flex flex-col space-y-4 w-[350px] ml-12 mb-10">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776] w-[350px] -ml-2"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776] w-[350px] -ml-2 mb-10"
              />
              <button
                type="submit"
                disabled={loading}
                className="h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl hover:bg-[#e887a9] transition duration-300 w-[350px] -ml-2 mb-10"
              >
                {loading ? "Signing In..." : "Continue"}
              </button>
            </form>
          )}

          {/* Mobile OTP Login */}
          {method === "mobile" && (
            <div className="flex flex-col space-y-4">
              <input
                type="text"
                name="mobileNumber"
                placeholder="Mobile Number"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776]"
              />
              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl hover:bg-[#e887a9] transition duration-300"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="p-3 border rounded-3xl border-[#b25776] focus:outline-none focus:ring-2 focus:ring-[#b25776]"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[50px] bg-[#b25776] text-white font-semibold py-2 rounded-3xl hover:bg-[#e887a9] transition duration-300"
                  >
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
