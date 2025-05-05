// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user=localStorage.getItem("userId");
  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-semibold text-green-600 hover:text-green-700 transition">
            🌱 Crop Shop
          </Link>

          {/* Nav Links */}
          <div className="space-x-8 hidden md:flex">
            <Link
              to="/availableCrops"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Crops
            </Link>
            <Link
              to="/disease"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Disease
            </Link>
            {/* <Link
              to="/warehouse-input"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Warehouse
            </Link> */}
            <Link
              to="/chatList"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Chat
            </Link>
           {
            user?(<>
            
            <Link
              
              className="text-gray-700 hover:text-green-600 transition font-medium"
              onClick={() => {
                window.location.href = "/";
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
              }}
            >
              Logout
            </Link>
            </>):(<>
            
            <Link

              to="/login"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Login
            </Link>

            </>)
           }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;