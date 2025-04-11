import React, { useEffect, useState } from 'react';

const BASE_URL = 'http://localhost:4000';

const CropsPage = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCrops = async () => {
    try {
      const res = await fetch(`${BASE_URL}/crops/getall`);
      const data = await res.json();
      setCrops(data);
    } catch (err) {
      console.error('Error fetching crops:', err);
    }
  };

  const fetchCropDetails = async (id) => {
    setLoading(true);
    try {
      // Fetch crop details
      const cropRes = await fetch(`${BASE_URL}/crops/getcrop/${id}`);
      if (!cropRes.ok) {
        throw new Error(`Failed to fetch crop: ${cropRes.status}`);
      }
      const cropData = await cropRes.json();
      setSelectedCrop(cropData);
  
      // console.log("Crop data:", cropData);
      // console.log("Farmer ID:", cropData.farmer);
  
      // Fetch user details
      if (cropData.farmer && typeof cropData.farmer === 'string') {
        const userUrl = `${BASE_URL}/user/getuser/${cropData.farmer}`;

const userRes = await fetch(userUrl);

        if (!userRes.ok) {
          throw new Error(`Failed to fetch user: ${userRes.status}`);
        }
        const userData = await userRes.json();
        setUserDetails(userData);
      } else {
        console.warn("Invalid farmer ID. Skipping user fetch.");
        setUserDetails(null);
      }
    } catch (err) {
      console.error('Error fetching crop/user details:', err.message || err);
      setUserDetails(null);
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crops for Sale</h1>

      {!selectedCrop ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {crops.map((crop) => (
            <div
              key={crop._id}
              onClick={() => fetchCropDetails(crop._id)}
              className="bg-white rounded-2xl shadow hover:shadow-lg cursor-pointer p-5 border border-gray-200 transition duration-200"
            >
              <h2 className="text-xl font-semibold text-gray-700 mb-2">{crop.name}</h2>
              <p className="text-gray-600">Quantity: {crop.quantity}</p>
              <p className="text-gray-600">Price/unit: ₹{crop.pricePerUnit}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow border border-gray-200">
          {loading ? (
            <p className="text-center text-gray-500">Loading crop details...</p>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedCrop.name}</h2>
              <p className="mb-2"><span className="font-semibold">Quantity:</span> {selectedCrop.quantity}</p>
              <p className="mb-2"><span className="font-semibold">Price per unit:</span> ₹{selectedCrop.pricePerUnit}</p>
              <p className="mb-4"><span className="font-semibold">Description:</span> {selectedCrop.description}</p>

              {userDetails && (
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Farmer Details</h3>
                  <p><span className="font-medium">Name:</span> {userDetails.name}</p>
                  <p><span className="font-medium">Email:</span> {userDetails.email}</p>
                  {/* Add more fields like phone, address if available */}
                </div>
              )}

              <button
                onClick={() => {
                  setSelectedCrop(null);
                  setUserDetails(null);
                }}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
              >
                Back to List
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CropsPage;
