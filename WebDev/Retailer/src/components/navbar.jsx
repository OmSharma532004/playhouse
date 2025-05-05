// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user=localStorage.getItem('token');
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
            {/* <Link
              to="/dashboard"
              className="text-gray-700 hover:text-green-600 transition font-medium"
            >
              Dashboard
            </Link> */}
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
              user ? (
                <button
                  onClick={()=>{
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    window.location.href='/auth/login';
                  }}
                 
                  className="text-gray-700 hover:text-green-600 transition font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="text-gray-700 hover:text-green-600 transition font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="text-gray-700 hover:text-green-600 transition font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;