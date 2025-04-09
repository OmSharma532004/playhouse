import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    <div className="bg-gray-50 w-60 p-6 flex flex-col shadow-lg border-r border-gray-200">
      {/* Brand Logo */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-12 tracking-wide">
        PolyFix
      </h1>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-8">
        <a href="#" className="text-gray-700   font-medium flex items-center hover:text-indigo-700 transition duration-200">
          <span className="flex-1">Dashboard</span>
        </a>
        <Link to="/crop-input" className="text-gray-700 font-medium flex items-center hover:text-indigo-700 transition duration-200">
          <span className="flex-1">Add Crop</span>
        </Link>
        <Link to="/warehouse-input" className="text-gray-700 font-medium flex items-center hover:text-indigo-700 transition duration-200">
          <span className="flex-1">Add Warehouse</span>
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="text-gray-700 font-medium flex items-center hover:text-red-600 transition duration-200 mt-12"
      >
        <span className="flex-1 text-start">Logout</span>
      </button>

      {/* Footer Action */}
      {/* <div className="mt-auto">
        <button className="w-full py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-md transition duration-200">
          Upgrade to PRO
        </button>
      </div> */}
    </div>
  );
};

export default Sidebar;
