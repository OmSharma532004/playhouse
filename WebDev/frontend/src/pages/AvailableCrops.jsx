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

        const res = await fetch( `${backendUrl}/crops/getallbyuser`, {
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
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center">Your Crops</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading crops...</p>
      ) : message ? (
        <p className="text-center text-red-500">{message}</p>
      ) : crops.length === 0 ? (
        <p className="text-center text-gray-500">No crops found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Price/Unit</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Date Added</th>
              </tr>
            </thead>
            <tbody>
              {crops.map((crop) => (
                <tr key={crop._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{crop.name}</td>
                  <td className="px-4 py-2">{crop.quantity}</td>
                  <td className="px-4 py-2">${crop.pricePerUnit.toFixed(2)}</td>
                  <td className="px-4 py-2">{crop.description}</td>
                  <td className="px-4 py-2">
                    {new Date(crop.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CropListByUser;
