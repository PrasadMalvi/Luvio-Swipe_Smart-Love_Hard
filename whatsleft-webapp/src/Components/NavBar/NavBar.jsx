import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icon for Mobile Menu

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-b from-[#4a4747] to-transparent fixed w-full top-0 z-50 h-20">
      <div className="container mx-auto flex justify-between items-center px-6 py-3 md:py-4 -mt-4">
        {/* Logo */}
        <NavLink to="/" className="flex items-center">
          <img
            src={require("../Assets/newlogo.png")}
            className="h-20 w-30 " // Increased logo height
            alt="WhatsLeft-logo"
          />
        </NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-white text-2xl">
          <li>
            <NavLink to="/about" className="nav-link">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/download" className="nav-link">
              Download
            </NavLink>
          </li>
          <li>
            <NavLink to="/safety" className="nav-link">
              Safety
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className="nav-link">
              Support
            </NavLink>
          </li>
        </ul>

        {/* Login Button */}
        <div className="hidden md:block">
          <NavLink
            to="/signIn"
            className="px-10 py-3 rounded-3xl bg-[#b25776] text-white h-[60px] hover:bg-[#e887a9] transition duration-300 text-xl"
          >
            Sign In
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <ul className="md:hidden bg-black text-white shadow-md flex flex-col items-center space-y-4 py-4 absolute w-full left-0 top-full">
          <li>
            <NavLink to="/about" className="nav-link" onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/download" className="nav-link" onClick={() => setIsOpen(false)}>
              Download
            </NavLink>
          </li>
          <li>
            <NavLink to="/safety" className="nav-link" onClick={() => setIsOpen(false)}>
              Safety
            </NavLink>
          </li>
          <li>
            <NavLink to="/support" className="nav-link" onClick={() => setIsOpen(false)}>
              Support
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signUp"
              className="px-4 py-2 bg-[#b25776] text-white rounded-md hover:bg-blue-700 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
