import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'http://localhost:4000';

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [selectedCrop, setSelectedCrop] = useState(null);
  const navigate = useNavigate();

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${BASE_URL}/crops/getall`);
      const data = await res.json();
      setCrops(data);

      const uniqueFarmerIds = [...new Set(data.map(crop => crop.farmer))];
      const map = {};

      await Promise.all(
        uniqueFarmerIds.map(async (farmerId) => {
          if (farmerId && typeof farmerId === 'string') {
            try {
              const userRes = await fetch(`${BASE_URL}/user/getuser/${farmerId}`);
              const userData = await userRes.json();
              map[farmerId] = userData;
            } catch (err) {
              console.error(`Error fetching user ${farmerId}:`, err);
            }
          }
        })
      );

      setUserMap(map);
    } catch (err) {
      console.error('Error fetching crops:', err);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleChatClick = (farmerId) => {
    navigate(`/chat/${farmerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-yellow-100 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">🌾 Crops for Sale</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Crop List */}
          <div className="md:w-1/2 space-y-4">
            {crops.map((crop) => (
              <div
                key={crop._id}
                onClick={() => setSelectedCrop(crop)}
                className={`cursor-pointer p-4 rounded-xl border border-gray-200 bg-white shadow hover:shadow-lg transition duration-200 ${selectedCrop?._id === crop._id ? 'ring-2 ring-green-500' : ''}`}
              >
                <h2 className="text-xl font-semibold text-green-700">🌱 {crop.name}</h2>
                <p className="text-gray-700"><span className="font-semibold">Qty:</span> {crop.quantity}</p>
                <p className="text-gray-700"><span className="font-semibold">Price:</span> ₹{crop.pricePerUnit}</p>
              </div>
            ))}
          </div>

          {/* Crop Details */}
          <div className="md:w-1/2">
            {selectedCrop ? (
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <h2 className="text-2xl font-bold text-green-700 mb-2">🌾 {selectedCrop.name}</h2>
                <p className="mb-1"><span className="font-semibold">Quantity:</span> {selectedCrop.quantity}</p>
                <p className="mb-1"><span className="font-semibold">Price per unit:</span> ₹{selectedCrop.pricePerUnit}</p>
                <p className="mb-4 italic text-gray-600">{selectedCrop.description}</p>
                {userMap[selectedCrop.farmer] && (
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">👨‍🌾 Farmer Info</h3>
                    <p><span className="font-medium">Name:</span> {userMap[selectedCrop.farmer].name}</p>
                    <p><span className="font-medium">Email:</span> {userMap[selectedCrop.farmer].email}</p>
                    <button
                      onClick={() => handleChatClick(selectedCrop.farmer)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow mt-4 transition"
                    >
                      💬 Chat with Farmer
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 text-lg text-center mt-10">Select a crop to view details</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropsPage;