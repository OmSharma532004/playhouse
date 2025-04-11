import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (isLogin && localStorage.getItem("userId")) {
      navigate("/dashboard");
    }
  }, [isLogin, navigate]);

  const handleSubmit = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userId", JSON.stringify(data.user._id));
        localStorage.setItem("token", data.token);
        setIsLogin(true);
      } else {
        console.error("Login failed. Status:", response.status);
      }
    } catch (error) {
      console.error("Error during login:", error);
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

      {/* Login Form */}
      <div className="w-full max-w-md p-8 bg-white/30 backdrop-blur-md rounded-xl shadow-xl animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
          Login to Your Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email and password to sign in.
        </p>

        {/* Form Fields */}
        <form className="space-y-6">
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
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>

        {/* Sign-Up Redirect */}
        <div className="mt-6 text-center">
          <p className="text-gray-700">
            Need an account?{" "}
            <Link
              to="/auth/signup"
              className="text-blue-600 hover:underline hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
