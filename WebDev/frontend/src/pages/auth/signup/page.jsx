import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    type: "",
  });

  useEffect(() => {
    if (isLogin && localStorage.getItem("userId")) {
      navigate("/dashboard");
    }
  }, [isLogin, navigate]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeChange = (selectedType) => {
    handleInputChange("type", selectedType);
  };

  const handleSubmit = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/user/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered successfully:", data);
        // localStorage.setItem("userId", JSON.stringify(data.user._id));
        setIsLogin(true);
      } else {
        const errorData = await response.json();
        console.error("Error registering user:", errorData.message);
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500">
      {/* Back to Home */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="text-white text-lg hover:text-yellow-300 transition duration-300"
        >
          &larr; Home
        </Link>
      </div>

      {/* Sign-Up Form */}
      <div className="w-full max-w-lg p-8 bg-white/30 backdrop-blur-md rounded-xl shadow-xl animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Create an Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your details to sign up.
        </p>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Type Selection */}
          <div>
            <label htmlFor="type" className="block text-lg font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="" disabled>
                Select your type
              </option>
              <option value="producer">Producer</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
