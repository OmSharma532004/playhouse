import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import EarningsCard from './EarningCards';
import LineChart from './LineChart';
import PieChartComponent from './PieChartComponent';
import Calendar from './Calendar';
import BarChartComponent from './BarChartComponent';



const Dashboard = () => {
  const [availableWarehouse, setAvailableWarehouse] = useState([]);
  const [warehouseDetails, setWarehouseDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [wareHouseId, setWarehouseId] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [modelPrediction, setModelPrediction] = useState({ spoilage: 0 });
  const [spoilageHistory, setSpoilageHistory] = useState([]);


  const TEMP_RANGE = { min: 0, max: 40 };
  const HUMIDITY_RANGE = { min: 30, max: 70 };
  const SUNLIGHT_RANGE = { min: 0, max: 100 };


  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [sunlight, setSunlight] = useState(null);

  function generateRandomValues(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  useEffect(() => {
    const fetchWarehouses = async () => {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      let userId = localStorage.getItem('userId');
      if (userId) userId = userId.replace(/^"(.*)"$/, '$1');
      
      try {
        const response = await fetch(`${backendUrl}/warehouse/getallwarehouses/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const warehouses = data.map((item) => ({ value: item.name, label: item.name }));
          setAvailableWarehouse(warehouses);
          console.log('Fetched warehouse data:', warehouses);
        } else {
          console.error('Failed to fetch warehouse data.');
        }
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
      }
    };
    fetchWarehouses();
  }, []);
 
  const fetchWarehouseDetails = async (warehouseName) => {
    try {
      const response = await fetch(`${backendUrl}/warehouse/getwarehousebyname/${warehouseName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch warehouse details: ${response.statusText}`);
      }
  
      const warehouseDetails = await response.json();
      console.log("Fetched Warehouse Details:", warehouseDetails);
      return warehouseDetails;
    } catch (error) {
      console.error('Error fetching warehouse details:', error);
      return null;
    }
  };
  
    


  useEffect(() => {
    const fetchSpoilageHistory = async () => {
      try {
        const response = await fetch(`${backendUrl}/spoilage/get`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  

        console.log("Raw response:", response);
  

        if (!response.ok) {
          throw new Error(`Error fetching spoilage history: ${response.statusText}`);
        }
  

        const history = await response.json();
        setSpoilageHistory(history);
      } catch (error) {
        console.error('Error fetching spoilage history:', error);
      }
    };
    fetchSpoilageHistory();
  }, []);

  
  

  useEffect(() => {
    if (selectedWarehouse) {
      callPredictionAPI();
    }
  }, [selectedWarehouse, temperature, humidity, sunlight]);


    useEffect(() => {
    const interval = setInterval(() => {
        if (selectedWarehouse) {
            setTemperature(generateRandomValues(TEMP_RANGE.min, TEMP_RANGE.max));
            setHumidity(generateRandomValues(HUMIDITY_RANGE.min, HUMIDITY_RANGE.max));
            setSunlight(generateRandomValues(SUNLIGHT_RANGE.min, SUNLIGHT_RANGE.max));
        }
    }, 60000);
    return () => clearInterval(interval);
    }, [selectedWarehouse]);



    const handleWarehouseChange = async (selectedOption) => {
      setSelectedWarehouse(selectedOption);
    

      const warehouseDetails = await fetchWarehouseDetails(selectedOption.value);
      if (warehouseDetails) {
        console.log("Selected Warehouse Details:", warehouseDetails);
        setWarehouseDetails(warehouseDetails);
        setWarehouseId(warehouseDetails._id);
        if(warehouseDetails._id){
          getAllProducts(warehouseDetails._id);
        }

    
        setTemperature(generateRandomValues(TEMP_RANGE.min, TEMP_RANGE.max));
        setHumidity(generateRandomValues(HUMIDITY_RANGE.min, HUMIDITY_RANGE.max));
        setSunlight(generateRandomValues(SUNLIGHT_RANGE.min, SUNLIGHT_RANGE.max));
    
 
      }
    };

    const getAllProducts = async (warehouseId) => {
      try {
        const response = await fetch(`${backendUrl}/product/getallproducts/${warehouseId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const products = await response.json();
        console.log("Fetched Products:", products);
        setProducts(products);
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    };

    


    

  const callPredictionAPI = async () => {
    try {
      const response = await fetch('https://freshtrackweb-1.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature, humidity, sunlight }),
      });
      if (response.ok) {
        const prediction = await response.json();
        const spoilagePercentage = isNaN(prediction.predicted_spoilage_probability)
          ? 0
          : prediction.predicted_spoilage_probability;
  
        setModelPrediction({ spoilage: spoilagePercentage });
  
       
        const newEntry = { spoilage: spoilagePercentage, temperature, humidity, sunlight };
        console.log("Saving new entry:", newEntry);
  
       
        await saveSpoilageData(newEntry);
  
        
        setSpoilageHistory((prevHistory) => [
          ...prevHistory,
          { ...newEntry, timestamp: new Date() },
        ]);
      } else {
        console.error('Failed to fetch prediction from the API.');
      }
    } catch (error) {
      console.error('Error connecting to the server:', error);
    }
  };
  
  const saveSpoilageData = async (data) => {
    try {
      const response = await fetch(`${backendUrl}/spoilage/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`Failed to save spoilage data: ${response.statusText}`);
      }
      console.log(response);
      console.log("Data saved successfully");
    } catch (error) {
      console.error('Error saving spoilage data:', error);
    }
  };
  

  
  const handleIncrement = (parameter) => {
    if (parameter === 'temperature') {
      setTemperature((prev) => Math.min(prev + 1, TEMP_RANGE.max));
    }
    if (parameter === 'humidity') {
      setHumidity((prev) => Math.min(prev + 1, HUMIDITY_RANGE.max));
    }
    if (parameter === 'sunlight') {
      setSunlight((prev) => Math.min(prev + 1, SUNLIGHT_RANGE.max));
    }
  };

  const handleDecrement = (parameter) => {
    if (parameter === 'temperature') {
      setTemperature((prev) => Math.max(prev - 1, TEMP_RANGE.min));
    }
    if (parameter === 'humidity') {
      setHumidity((prev) => Math.max(prev - 1, HUMIDITY_RANGE.min));
    }
    if (parameter === 'sunlight') {
      setSunlight((prev) => Math.max(prev - 1, SUNLIGHT_RANGE.min));
    }
  };

  return (
    <div className="grid grid-cols-4 gap-6 p-6 bg-gray-100 min-h-screen">
  
      <div className='w-[50vw]' >
        {selectedWarehouse ? (
          
        
          <div className=' flex justify-between items-center '>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {selectedWarehouse.value}
            
            
          </h2>
          <div>
{
  warehouseDetails && (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Polyhouse Details</h3>
      <p className="text-gray-600">Location: {warehouseDetails.location}</p>
      <p className="text-gray-600">Capacity: {warehouseDetails.capacity} kg</p>
    </div>
  )

}

          </div>
          </div>

        ) : (
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select a Polyhouse to get started</h2>
        )}
        
      </div>
      <div className="col-span-4 mb-4">
        <Select
          options={availableWarehouse}
          onChange={handleWarehouseChange}
          placeholder="Select a Polyhouse..."
          className="w-full"
        />
      </div>
    

      {/* Dynamic Earnings Cards with controls */}
      {/* <EarningsCard
        title="Temperature"
        number={selectedWarehouse ? temperature : " - - - "}
        change={5}
        onIncrement={() => handleIncrement('temperature')}
        onDecrement={() => handleDecrement('temperature')}
      />
      <EarningsCard
        title="Humidity"
        number={selectedWarehouse ? humidity : " - - - "}
        change={10}
        onIncrement={() => handleIncrement('humidity')}
        onDecrement={() => handleDecrement('humidity')}
      />
      <EarningsCard
        title="Sunlight Exposure"
        number={selectedWarehouse ? sunlight : " - - - "}
        change={-10}
        onIncrement={() => handleIncrement('sunlight')}
        onDecrement={() => handleDecrement('sunlight')}
      /> */}


      {/* <div className="col-span-4 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <PieChartComponent spoilage={modelPrediction.spoilage} />
      </div>

      <div className="col-span-4 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <LineChart data={spoilageHistory} />
      </div> */}

    
      <div className="col-span-4 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <Calendar events={spoilageHistory} />
      </div>
      {
  products.length > 0 && (
    <div className="col-span-4 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product Quantities</h2>
      <BarChartComponent data={products.map(product => ({ crop: product.crop, quantity: product.quantity }))} />
    </div>
  )
}

    </div>
  );
};

export default Dashboard;
