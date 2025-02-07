import React, { useState } from "react";
import SignUp from "./SignUp";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/NavBar/footer";
import { X } from "lucide-react";
const IndexPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="relative">
      {/* Navbar - Ensure it's on top */}
      <div className="relative z-50">
        <NavBar />
      </div>

      {/* Background Image Section */}
      <div className="relative h-screen w-full">
        <img
          src={require("../Components/Assets/newhome-bg.jpg")}
          className="w-full h-[776px] object-cover"
          alt="Background"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center bg-black bg-opacity-50">
          <h1 className="text-5xl font-bold mb-4">Start Swiping Right!</h1>
          <button
            onClick={() => setShowSignUp(true)}
            className="px-6 py-3 bg-[#b25776] text-white text-lg rounded-full hover:bg-[#e887a9] transition duration-300"
          >
            Sign Up Now
          </button>
        </div>
      </div>
      <div className="bg-black py-16 mb-0.5">
        <div className="max-w-7xl mx-auto px-1 grid md:grid-cols-3 gap-16 text-white text-center">
          {/* Straight Dating Section */}
          <div className="flex flex-col items-center">
            <img
              src={require("../Components/Assets/mbanner1.png")}
              className="w-58 h-58 object-cover rounded-3xl shadow-lg mb-6"
              alt="Straight Dating"
            />
            <h2 className="text-3xl font-semibold mb-4">
              Find Your True Love!
            </h2>
            <p className="text-lg text-gray-300">
              Connect with like-minded individuals and start meaningful
              relationships.
            </p>
          </div>

          {/* LGBTQ+ Dating Section */}
          <div className="flex flex-col items-center">
            <img
              src={require("../Components/Assets/mbanner2.png")}
              className="w-58 h-68 object-cover rounded-3xl shadow-lg mb-6"
              alt="LGBTQ+ Dating"
            />
            <h2 className="text-3xl font-semibold mb-4">Love Without Limits</h2>
            <p className="text-lg text-gray-300">
              Explore a safe and welcoming space to meet your perfect match.
            </p>
          </div>

          {/* Messaging & Communication Section */}
          <div className="flex flex-col items-center">
            <img
              src={require("../Components/Assets/mbanner3.png")}
              className="w-58 h-58 object-cover rounded-3xl shadow-lg mb-6"
              alt="Messaging & Communication"
            />
            <h2 className="text-3xl font-semibold mb-4">
              Chat & Plan Your Date
            </h2>
            <p className="text-lg text-gray-300">
              Send real-time messages and schedule your next romantic adventure.
            </p>
          </div>
        </div>
      </div>
      {/* Sign-Up Form */}
      {showSignUp && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-transparent p-8 rounded-lg shadow-lg w-100">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-40 right-10 mr-45 decoration-inherit  "
            >
              <X size={35} color="#b25776" />
            </button>
            <SignUp />
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IndexPage;
