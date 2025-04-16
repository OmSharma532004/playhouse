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

      {/* Login Card */}
      <div className="w-full max-w-md px-10 py-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl animate-fade-in">
        <h2 className="text-3xl font-bold text-white text-center mb-3 tracking-wide">
          Welcome Back
        </h2>
        <p className="text-center text-gray-300 mb-8 text-base">
          Sign in to continue to your dashboard
        </p>

        {/* Form */}
        <form className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:ring-2 focus:ring-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg rounded-lg shadow-lg hover:scale-[1.02] transition-transform focus:outline-none focus:ring-4 focus:ring-cyan-300"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/auth/signup"
              className="text-cyan-400 font-medium hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;