import React from "react";
import { Github, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-[#b25776] py-8">
      <div className="container mx-auto px-6 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ml-40 ">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About Us</h3>
            <ul>
              <li><a href="#" className="hover:underline">Who We Are</a></li>
              <li><a href="#" className="hover:underline">How It Works</a></li>
              <li><a href="#" className="hover:underline">Safety Tips</a></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Help & Support</h3>
            <ul>
              <li><a href="#" className="hover:underline">FAQs</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Report a Problem</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms & Conditions</a></li>
              <li><a href="#" className="hover:underline">Community Guidelines</a></li>
            </ul>
          </div>

          {/* Social Media */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Stay Connected</h3>
                <div className="flex space-x-4">
                    <a href="https://github.com/prasadmalvi" target="_blank" rel="noopener noreferrer">
                        <Github className="text-[#b25776] w-6 h-6 hover:text-gray-300" />
                    </a>
                    <a href="https://www.instagram.com/malviprasad/" target="_blank" rel="noopener noreferrer">
                        <Instagram className="text-[#b25776] w-6 h-6 hover:text-gray-300" />
                    </a>
                    <a href="https://www.linkedin.com/in/prasadmalvi/" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="text-[#b25776] w-6 h-6 hover:text-gray-300" />
                    </a>
                </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 border-t border-white pt-4">
          <p>&copy; {new Date().getFullYear()} Your Dating App. Built by <span className="font-bold">Prasad Malvi</span>. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
