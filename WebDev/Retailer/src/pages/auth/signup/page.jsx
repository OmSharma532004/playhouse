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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-slate-900 via-gray-900 to-gray-800 relative">
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
      <div className="w-full max-w-lg px-10 py-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-3 tracking-wide">
          Create Account
        </h2>
        <p className="text-center text-gray-300 mb-8 text-base">
          Join the community to access your dashboard
        </p>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Account Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-white mb-2">
              Account Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/70 rounded-lg border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="" disabled>
                Select account type
              </option>
              <option value="producer">Producer</option>
              <option value="retailer">Retailer</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg rounded-lg shadow-lg hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            Sign Up
          </button>
        </form>

        {/* Redirect to Login */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-cyan-400 font-medium hover:underline"
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