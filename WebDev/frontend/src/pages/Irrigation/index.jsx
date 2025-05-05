import React, { useState } from 'react';

export default function IrrigationAdvisor() {
  const [soilMoisture, setSoilMoisture] = useState('');
  const [temperature, setTemperature] = useState('');
  const [airHumidity, setAirHumidity] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!soilMoisture || !temperature || !airHumidity) return;

    const features = [parseFloat(soilMoisture), parseFloat(temperature), parseFloat(airHumidity)];
    setLoading(true);
    setPrediction(null);

    try {
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features })
      });

      const result = await response.json();
      setPrediction({ result: result.prediction, input: features });
    } catch (error) {
      setPrediction({ error: 'Failed to fetch prediction' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex">
      <aside className="w-64 bg-blue-800 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-6">Irrigation Tips</h2>
        <ul className="space-y-4 text-sm">
          <li>💧 Water early in the morning or late afternoon.</li>
          <li>🌾 Avoid overwatering to prevent root rot.</li>
          <li>📉 Monitor soil moisture regularly.</li>
          <li>🌤️ Adjust watering during different weather patterns.</li>
          <li>🧠 Use data-driven tools for efficiency.</li>
        </ul>
        <div className="mt-auto pt-6 text-xs">&copy; 2025 Smart Irrigation Pro</div>
      </aside>

      <main className="flex-1 p-10 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
          💧 Smart Irrigation Advisor
        </h1>

        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
          <input
            type="number"
            step="0.01"
            placeholder="Soil Moisture"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Air Humidity"
            value={airHumidity}
            onChange={(e) => setAirHumidity(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <button
            onClick={handlePredict}
            disabled={loading}
            className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold"
          >
            {loading ? 'Analyzing...' : 'Predict Irrigation'}
          </button>

          {prediction && prediction.input && (
            <ul className="text-gray-700">
              <li>Soil Moisture: {prediction.input[0]}</li>
              <li>Temperature: {prediction.input[1]}</li>
              <li>Air Humidity: {prediction.input[2]}</li>
            </ul>
          )}

          {prediction && 'result' in prediction && (
            <div className={`text-xl font-bold ${prediction.result === 1 ? 'text-red-600' : 'text-green-600'}`}>
              {prediction.result === 1 ? '💦 Irrigation Required' : '✅ No Irrigation Needed'}
            </div>
          )}

          {prediction && prediction.error && (
            <div className="text-red-500 mt-4">{prediction.error}</div>
          )}
        </div>
      </main>
    </div>
  );
}