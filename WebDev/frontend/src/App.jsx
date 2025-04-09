// App.jsx
import React from 'react';
import './chartSetup';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './pages/auth/login/page';
import SignUpForm from './pages/auth/signup/page';
import CropInput from './pages/CropInput';
import WarehouseInput from './pages/Warehouse';
import Dashboard from './pages/Dashboard/Dashboard';

import { WarehouseProvider } from './components/contextapi/WarehouseContext'; // Import the WarehouseProvider
import Dashboard2 from './pages/Dashboard2/index';


const App = () => {
  return (
    <WarehouseProvider> 
      <Routes>
       
        <Route path="/" element={<Home />} />

        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/signup" element={<SignUpForm />} />
        <Route path="/crop-input" element={<CropInput />} />
        <Route path="/warehouse-input" element={<WarehouseInput />} />
        <Route path="/dashboard" element={<Dashboard2 />} />
      </Routes>
    </WarehouseProvider>
  );
};

export default App;
