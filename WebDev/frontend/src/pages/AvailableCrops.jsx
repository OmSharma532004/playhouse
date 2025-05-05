import React, { useEffect, useState } from 'react';

const CropListByUser = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Sending token:', token); // check this before fetch

        const res = await fetch(`${backendUrl}/crops/getallbyuser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch crops');
        }

        setCrops(data);
      } catch (error) {
        console.error('Error fetching crops:', error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-6 text-center text-indigo-800">Your Crops</h2>

      {loading ? (
        <div className="text-center text-gray-500 animate-pulse">
          <p className="text-lg">Loading crops...</p>
        </div>
      ) : message ? (
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{message}</p>
        </div>
      ) : crops.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg">No crops found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {crops.map((crop) => (
            <div
              key={crop._id}
              className="bg-white rounded-lg shadow-xl p-6 hover:scale-105 transition-all duration-300 transform"
            >
              <h3 className="text-xl font-semibold text-indigo-800">{crop.name}</h3>
              <p className="text-gray-600 mt-2">
                <strong>Quantity:</strong> {crop.quantity}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Price/Unit:</strong> ${crop.pricePerUnit.toFixed(2)}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Description:</strong> {crop.description}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Date Added:</strong> {new Date(crop.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}

      
      <div className="mt-8 text-center">
        <button
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300"
          onClick={() => (window.location.href = '/crop-input')}
        >
          Add New Crop
        </button>
</div>

    </div>
  );
};

export default CropListByUser;