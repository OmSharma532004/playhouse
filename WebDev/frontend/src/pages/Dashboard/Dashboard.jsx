import { useState, useEffect } from "react";
import Card from "./Card";
import Chart from "./Chart";
import Rightbar from "./Rightbar";
import { PercentageDonutChart } from "./Donutchart";
import Select from "react-select";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [CropItems, setCropItems] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [availableWarehouse, setAvailableWarehouse] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("Wheat");
  const [data, setData] = useState([]);
  const [dynamicCards, setDynamicCards] = useState([]);
  const [modelPrediction, setModelPrediction] = useState({
    spoilage: 0,
  });

  // State variables for adjustable parameters
  const [temperature, setTemperature] = useState(generateRandomValues(20, 40));
  const [humidity, setHumidity] = useState(generateRandomValues(30, 70));
  const [sunlight, setSunlight] = useState(generateRandomValues(0, 100));

  function generateRandomValues(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Fetch warehouse data on component mount
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
          const dataa = await response.json();
          setData(dataa);
          const warehouses = dataa.map((item) => ({
            value: item.name,
            label: item.name,
          }));
          setAvailableWarehouse(warehouses);
        } else {
          console.error("Failed to fetch warehouse data.");
        }
      } catch (error) {
        console.error("Error fetching warehouse data:", error);
      }
    };
    getWarehouse();
  }, []);

  // Fetch crop and predict data when warehouse or crop selection changes
  useEffect(() => {
    const getDataAndPredict = async () => {
      if (!selectedWarehouse) return;

      const warehouse = data.find((w) => w.name === selectedWarehouse.value);
      const warehouseId = warehouse ? warehouse._id : undefined;

      if (!warehouseId) return;

      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      try {
        const cropResponse = await fetch(
          `${backendUrl}/product/getproduct/${warehouseId}/${selectedCrop}`
        );
        if (cropResponse.ok) {
          const cropData = await cropResponse.json();

          const updatedDynamicCards = [
            { title: "Temperature", number: temperature, change: 5 },
            { title: "Humidity", number: humidity, change: 10 },
            { title: "Sunlight Exposure", number: sunlight, change: -10 },
          ];
          setDynamicCards(updatedDynamicCards);

          callPredictionAPI(); // Call prediction API with the generated values
        } else {
          console.error("Failed to fetch crop data.");
        }
      } catch (error) {
        console.error("Error during fetching data or prediction:", error);
      }
    };

    getDataAndPredict();
  }, [selectedWarehouse, selectedCrop, data, temperature, humidity, sunlight]);

  // Function to call prediction API with current values
  const callPredictionAPI = async () => {
    try {
      const response = await fetch("https://freshtrackweb-1.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature,
          humidity,
          sunlight,
        }),
      });
  
      if (response.ok) {
        const prediction = await response.json();
        setModelPrediction({
          spoilage: isNaN(prediction.predicted_spoilage_percentage)
            ? 0
            : prediction.predicted_spoilage_percentage,
        });
      } else {
        console.error("Failed to fetch prediction from the API.");
      }
    } catch (error) {
      console.error("Error connecting to the server:", error);
    }
  };
  

  // Handlers for incrementing and decrementing values
  const handleIncrement = (parameter) => {
    if (parameter === "temperature") setTemperature((prev) => prev + 1);
    if (parameter === "humidity") setHumidity((prev) => prev + 1);
    if (parameter === "sunlight") setSunlight((prev) => prev + 1);
  };

  const handleDecrement = (parameter) => {
    if (parameter === "temperature") setTemperature((prev) => prev - 1);
    if (parameter === "humidity") setHumidity((prev) => prev - 1);
    if (parameter === "sunlight") setSunlight((prev) => prev - 1);
  };

  // Update `dynamicCards` whenever temperature, humidity, or sunlight changes
  useEffect(() => {
    setDynamicCards((prevCards) =>
      prevCards.map((card) => {
        if (card.title === "Temperature") return { ...card, number: temperature };
        if (card.title === "Humidity") return { ...card, number: humidity };
        if (card.title === "Sunlight Exposure") return { ...card, number: sunlight };
        return card;
      })
    );
    callPredictionAPI(); // Trigger API with updated values
  }, [temperature, humidity, sunlight]);


  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="text-lg font-semibold">admin</div>
            <div className="text-sm text-gray-400">Administrator</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          <a href="#" className="flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
            <span className="flex-1">Dashboard</span>
          </a>
          <Link to="/crop-input" className="flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
            <span className="flex-1">Add Crop</span>
          </Link>
          <Link to="/warehouse-input" className="flex items-center px-4 py-2 text-gray-300 rounded-md hover:bg-gray-700 hover:text-white">
            <span className="flex-1">Add Warehouse</span>
          </Link>
        </nav>
      </aside>
  
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <button className="text-gray-600">Logout</button>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex gap-6 mb-6 items-center">
            <Select options={availableWarehouse} onChange={setSelectedWarehouse} className="flex-1" placeholder="Select a Warehouse..." />
            <select onChange={(e) => setSelectedCrop(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded">
              {CropItems.map((crop, index) => (
                <option key={index}>{crop.crop}</option>
              ))}
            </select>
          </div>
  
          <div className="flex gap-4 mb-6 justify-center">
            <PercentageDonutChart percentage={modelPrediction.spoilage} label1={"Spoilage"} />
          </div>
  
          <div className="flex gap-2 items-center mb-6">
            <div className="mr-4">
              <span>Temperature: {temperature}</span>
              <button onClick={() => handleIncrement("temperature")} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">+</button>
              <button onClick={() => handleDecrement("temperature")} className="ml-1 px-2 py-1 bg-red-500 text-white rounded">-</button>
            </div>
            <div className="mr-4">
              <span>Humidity: {humidity}</span>
              <button onClick={() => handleIncrement("humidity")} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">+</button>
              <button onClick={() => handleDecrement("humidity")} className="ml-1 px-2 py-1 bg-red-500 text-white rounded">-</button>
            </div>
            <div className="mr-4">
              <span>Sunlight: {sunlight}</span>
              <button onClick={() => handleIncrement("sunlight")} className="ml-2 px-2 py-1 bg-blue-500 text-white rounded">+</button>
              <button onClick={() => handleDecrement("sunlight")} className="ml-1 px-2 py-1 bg-red-500 text-white rounded">-</button>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {dynamicCards.length === 0 ? (
              <div className="col-span-3 text-center text-gray-600">
                No Crop Found for this crop and warehouse
              </div>
            ) : (
              dynamicCards.map((item, i) => <Card key={i} item={item} />)
            )}
          </div>
          {/* <Chart data={dynamicChart} /> */}
        </main>
      </div>
  
      <Rightbar />
    </div>
    
  );
};
export default Dashboard;  