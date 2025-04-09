import React, { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const CropInput = () => {
  const [crops, setCrops] = useState([]);
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [availableCrops, setAvailableCrops] = useState(["Rice", "Wheat", "Corn"]);
  const [availableWarehouse, setAvailableWarehouse] = useState([]);
  const [sunlight, setSunlight] = useState("fullSun");
  const [pesticide, setPesticide] = useState("organic");
  const [moisture, setMoisture] = useState("");
  const [temperature, setTemperature] = useState("");
  const [warehouseId, setWarehouseId] = useState("");

  useEffect(() => {
    const getWarehouse = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      let userId = localStorage.getItem("userId");

      if (userId && typeof userId === "string") {
        userId = userId.replace(/^"(.*)"$/, "$1");
      }
      const apiUrl = `${backendUrl}/warehouse/getallwarehouses/${userId}`;

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setAvailableWarehouse(data);
        } else {
          console.error("Failed to fetch warehouse data.");
        }
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
      }
    };
    getWarehouse();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cropName && quantity) {
      const newCrop = {
        crop: cropName,
        quantity: quantity,
        warehouseID: warehouseId,
      };

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const apiUrl = `${backendUrl}/product/createproduct`;

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCrop),
        });

        if (response.ok) {
          alert("Crop is added");
          window.location.href = "/dashboard";
        } else {
          console.error("Failed to add new crop.");
        }
      } catch (error) {
        console.error("Error adding new crop:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500">
      <div className="absolute top-6 left-6">
        <Link
          to="/dashboard"
          className="flex items-center text-white text-lg hover:text-yellow-300 transition duration-300"
        >
          <FaChevronLeft className="mr-2 text-xl" />
          Go Back To Dashboard
        </Link>
      </div>

      <div className="w-full max-w-lg p-8 bg-white/30 backdrop-blur-md rounded-xl shadow-xl animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Crop Input Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Warehouse Selection */}
          <div>
            <label htmlFor="warehouse" className="block text-lg font-medium text-gray-700 mb-2">
              Warehouses
            </label>
            <select
              id="warehouse"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="" disabled>
                Select Warehouse
              </option>
              {availableWarehouse.map((warehouse, index) => (
                <option key={index} value={warehouse._id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Crop Name Selection */}
          <div>
            <label htmlFor="cropName" className="block text-lg font-medium text-gray-700 mb-2">
              Crop Name
            </label>
           <input type="text" id="cropName" value={cropName} onChange={(e) => setCropName(e.target.value)} className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300" />
          </div>

          {/* Quantity Input */}
          <div>
            <label htmlFor="quantity" className="block text-lg font-medium text-gray-700 mb-2">
              Quantity(in Kg)
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-3 bg-gray-100 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          </div>

        

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-teal-400 text-white font-bold rounded-lg hover:scale-105 transform transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Add Crop
          </button>
        </form>
      </div>
    </div>
  );
};

export default CropInput;
