import React, { useState } from 'react';

export default function PlantDiseaseDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      setIsLoading(true);
      setUploadStatus('Uploading...');
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPredictions(result);
        setUploadStatus('Prediction complete!');
      } else {
        setUploadStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPredictionCircles = () => {
    if (!predictions) return null;
    const maxLabel = Object.entries(predictions).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    return (
      <div className="flex gap-6 flex-wrap justify-center mt-6">
        {Object.entries(predictions).map(([label, value]) => {
          const percentage = (value * 100).toFixed(1);
          const isTop = label === maxLabel;
          return (
            <div key={label} className={`flex flex-col items-center transition-transform duration-500 ${isTop ? 'scale-110' : 'scale-100'}`}>
              <div className="relative">
                <svg className="w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#ccc"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#34D399"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={(1 - value) * 2 * Math.PI * 40}
                    transform="rotate(-90 48 48)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <span className="absolute top-9 left-7 text-lg font-bold">{percentage}%</span>
              </div>
              <span className="mt-2 capitalize text-gray-700 font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-green-50 flex">
      <aside className="w-64 bg-green-700 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">Plant Care Tips</h2>
        <ul className="space-y-4 text-sm">
          <li>🌿 Water consistently but avoid overwatering.</li>
          <li>☀️ Ensure at least 6 hours of sunlight daily.</li>
          <li>🌱 Use disease-resistant plant varieties.</li>
          <li>🪴 Maintain soil health with compost and mulch.</li>
          <li>✂️ Prune regularly to avoid crowded growth.</li>
          <li>🧹 Clean gardening tools after use.</li>
          <li>🛡️ Monitor for pests and apply natural remedies early.</li>
        </ul>
        <div className="mt-auto pt-6 text-xs">&copy; 2025 Plant Health Pro</div>
      </aside>

      <main className="flex-1 p-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
          🌿 Plant Disease Detection System
        </h1>
        <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
          Upload a photo of your plant's leaves or stems, and we'll help identify any possible diseases instantly.
        </p>

        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col items-center">
            <label htmlFor="upload" className="w-full flex flex-col items-center px-4 py-6 bg-green-100 text-green-700 rounded-lg shadow-md tracking-wide uppercase border border-green-300 cursor-pointer hover:bg-green-200">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.88 9.94A5 5 0 1110 4a5 5 0 016.88 5.94zM18 13h-1a4 4 0 00-7.9-1.28A5.5 5.5 0 003 16.5 5.5 5.5 0 008.5 22H18a4 4 0 000-8z" />
              </svg>
              <span className="mt-2 text-base leading-normal">Choose a plant photo</span>
              <input type="file" id="upload" className="hidden" onChange={handleFileChange} />
            </label>

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-6 w-64 h-64 object-cover rounded-lg shadow" />
            )}

            <button
              onClick={handleUpload}
              className="mt-6 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Upload & Detect'}
            </button>

            {uploadStatus && (
              <p className="mt-4 text-sm text-gray-600 text-center">{uploadStatus}</p>
            )}

            {renderPredictionCircles()}
          </div>
        </div>
      </main>
    </div>
  );
}
