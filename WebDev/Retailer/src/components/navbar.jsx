// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-green-400 to-blue-500 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          🌱 Crop Shop
        </Link>

        <div className="space-x-6">
          <Link to="/availableCrops" className="text-white hover:text-gray-300">
            Crops
          </Link>
          <Link to="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/warehouse-input" className="text-white hover:text-gray-300">
            Warehouse
          </Link>
          <Link to="/chatList" className="text-white hover:text-gray-300">
            Chat
          </Link>
          <Link to="/auth/login" className="text-white hover:text-gray-300">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;