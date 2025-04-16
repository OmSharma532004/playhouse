import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefce8] to-[#fef9c3] text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="bg-white bg-opacity-90 p-10 rounded-xl shadow-xl max-w-4xl w-full">
          <h1 className="text-5xl font-extrabold text-green-700 mb-6">🌱 Welcome to Crop Chain</h1>
          <p className="text-xl text-gray-700 mb-8">
            Connecting every link in the agricultural journey — CropChain streamlines crop storage, trading, and management to ensure quality, reduce waste, and boost profits.
          </p>
          <Link
            to="/auth/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-md transition"
          >
            Register / Sign In
          </Link>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-white px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-green-800 mb-6">🌾 Why Choose Our Storage Solutions?</h2>
          <p className="text-lg text-center text-gray-600 mb-10">
            Reduce spoilage, maximize profit, and embrace sustainability with CropChain’s modern crop storage solutions.
          </p>
          <ul className="grid md:grid-cols-2 gap-6 text-gray-700 text-lg">
            <li><span className="text-green-600 font-bold">✓ Reduced Waste:</span> Optimized temperature & humidity control.</li>
            <li><span className="text-green-600 font-bold">✓ Cost Efficiency:</span> Extend shelf life and reduce losses.</li>
            <li><span className="text-green-600 font-bold">✓ Real-time Monitoring:</span> Get alerts before issues arise.</li>
            <li><span className="text-green-600 font-bold">✓ Custom Solutions:</span> Tailored to every crop's needs.</li>
            <li><span className="text-green-600 font-bold">✓ Eco-friendly Practices:</span> Lower food waste = greener planet.</li>
            <li><span className="text-green-600 font-bold">✓ Longer Shelf Life:</span> Fresh produce, longer marketing windows.</li>
          </ul>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-green-50 px-6 py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-6">🚜 Key Features of Crop Chain</h2>
          <p className="text-lg text-gray-700 mb-10">
            Empowering farmers and warehouse owners with powerful tools to manage, monitor, and market their crops efficiently.
          </p>
          <ul className="grid md:grid-cols-3 gap-8 text-left">
            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-green-700 mb-2">Polyhouse Production</h3>
              <p>High-yield crops in controlled environments using our optimized solutions.</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-green-700 mb-2">Smart Trading</h3>
              <p>Buy and sell directly from warehouses with full transparency and control.</p>
            </li>
            <li className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-green-700 mb-2">Crop Management</h3>
              <p>Track, store, and manage crop lifecycles effortlessly from a central dashboard.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;