// Home.js
import React from 'react';

import { Link } from 'react-router-dom'; 

const Home = () => {
  return (
    <div className="bg-cover bg-center min-h-screen text-white flex flex-col items-center py-10" >
      {/* Homepage Section */}
      <section className="bg-black flex-col items-center justify-center bg-opacity-70 w-full max-w-6xl p-10 rounded-lg text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-500 mb-5">Welcome to Crop Chain</h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          “Connecting every link in the agricultural journey—CropChain streamlines crop storage, trading, and management with advanced solutions to ensure quality, reduce waste, and maximize profitability.”
        
        </p>
        <div className="flex items-center mx-auto   justify-center gap-4">
        <Link className='bg-yellow-400 p-4 text-black font-bold text-lg' to="/auth/login">
<button>Register / Sign In</button>
</Link>

        </div>
      </section>


      {/* Benefits Section */}
      <section className="bg-black bg-opacity-70 w-full max-w-6xl p-10 rounded-lg text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-5">Why Choose Our Storage Solutions?</h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Managing food spoilage is critical for ensuring long-term profitability and sustainability in the agricultural industry.
          With our advanced storage solutions, users benefit from:
        </p>

        <ul className="text-left max-w-3xl mx-auto text-gray-200 list-disc pl-5">
          <li className="mb-2"><strong className="text-yellow-500">Reduced Waste:</strong> Our systems minimize food spoilage through optimized temperature and humidity control.</li>
          <li className="mb-2"><strong className="text-yellow-500">Cost Efficiency:</strong> By extending the shelf life of stored crops, users can significantly cut down on losses and improve overall profits.</li>
          <li className="mb-2"><strong className="text-yellow-500">Advanced Monitoring:</strong> Real-time monitoring and alerts help prevent issues before they affect the quality of your produce.</li>
          <li className="mb-2"><strong className="text-yellow-500">Custom Solutions:</strong> We tailor our storage techniques to match the unique needs of different crops, ensuring maximum quality retention.</li>
          <li className="mb-2"><strong className="text-yellow-500">Eco-friendly Practices:</strong> Our solutions contribute to sustainable practices by reducing carbon footprint associated with food wastage.</li>
          <li className="mb-2"><strong className="text-yellow-500">Increased Shelf Life:</strong> Effective temperature and moisture regulation extends the freshness of stored products, allowing for longer marketing windows.</li>
        </ul>

      </section>

      {/* Features Section */}
      <section className="bg-black bg-opacity-70 w-full max-w-6xl p-10 rounded-lg text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-500 mb-5">Key Features of Crop Chain</h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8">
          Explore how Crop Chain extends its offerings to empower farmers and warehouse owners with advanced tools for better crop and business management.
        </p>
        <ul className="text-left max-w-3xl mx-auto text-gray-200 list-disc pl-5">
          <li className="mb-2"><strong className="text-yellow-500">Crop Production in Polyhouse:</strong> We offer solutions for controlled-environment agriculture, enabling higher yields and better crop quality in polyhouses.</li>
          <li className="mb-2"><strong className="text-yellow-500">Buy and Sell from Warehouses:</strong> Simplify transactions with our platform that connects buyers and sellers for efficient crop trading directly from warehouses.</li>
          <li className="mb-2"><strong className="text-yellow-500">Complete Crop Management System:</strong> Our system provides tools for seamless management of crops, catering to the needs of farmers and warehouse owners alike, ensuring streamlined operations and better decision-making.</li>
        </ul>
      </section>
    </div>
  );
};

export default Home;