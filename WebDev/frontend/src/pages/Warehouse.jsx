import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useWarehouseContext } from "../components/contextapi/WarehouseContext";
import { useNavigate, Link } from "react-router-dom";

const WarehouseInput = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
  });
  const { dispatch } = useWarehouseContext();
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        dispatch({ type: "ADD_WAREHOUSE", payload: formData });
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        let userId = localStorage.getItem("userId");
        if (userId && typeof userId === "string") {
          userId = userId.replace(/^"(.*)"$/, "$1");
        }
        formData["userId"] = userId;

        const response = await fetch(`${backendUrl}/warehouse/createwarehouse`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          navigate("/dashboard");
        } else {
          console.error("Warehouse creation failed.");
        }
      } catch (error) {
        console.error("Error during warehouse creation:", error);
      }
    } else {
      console.log("Please fill in all required fields.");
    }
  };

  const validateForm = () => {
    return formData.name && formData.location && formData.capacity;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500">
      {/* Back Button */}
      <Link
        to="/dashboard"
        className="absolute top-6 left-6 flex items-center text-white text-lg hover:text-yellow-300 transition duration-300"
      >
        <FaChevronLeft className="mr-2 text-xl" />
        Go Back To Dashboard
      </Link>

      {/* Page Heading */}
      <h1 className="text-5xl font-bold text-white mb-8 animate-fade-in">
        Build YOUR Warehouse
      </h1>

      {/* Form Container */}
      <div className="bg-gradient-to-r from-white to-gray-100 p-8 rounded-xl shadow-2xl w-[90%] max-w-md animate-slide-up">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
          Enter Your Warehouse Details
        </h2>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div>
            <label className="block mb-2 text-lg text-gray-700 font-medium">
              Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleOnChange}
              placeholder="Enter your Warehouse Name"
              className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-blue-400 focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block mb-2 text-lg text-gray-700 font-medium">
              Location
            </label>
            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleOnChange}
              placeholder="Enter Warehouse Location"
              className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-green-400 focus:ring focus:ring-green-300"
            />
          </div>

          {/* Capacity Input */}
          <div>
            <label className="block mb-2 text-lg text-gray-700 font-medium">
              Capacity(in Kg)
            </label>
            <input
              required
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleOnChange}
              placeholder="Enter Warehouse Capacity"
              className="w-full p-3 rounded-lg bg-gray-100 border-2 border-gray-300 focus:outline-none focus:border-purple-400 focus:ring focus:ring-purple-300"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-4 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-teal-400 rounded-lg hover:from-blue-600 hover:to-teal-500 transition-transform duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default WarehouseInput;
