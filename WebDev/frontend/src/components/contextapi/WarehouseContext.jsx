import React, { createContext, useContext, useReducer, useEffect } from "react";


const initialState = {
  warehouses: [],
};

const warehouseReducer = (state, action) => {
  switch (action.type) {
    case "ADD_WAREHOUSE":
      return {
        ...state,
        warehouses: [...state.warehouses, action.payload],
      };
 
    default:
      return state;
  }
};


const WarehouseContext = createContext();


const WarehouseProvider = ({ children }) => {
  
  const storedState = JSON.parse(localStorage.getItem("warehouseState")) || initialState;
  const [state, dispatch] = useReducer(warehouseReducer, storedState);

 
  useEffect(() => {
    localStorage.setItem("warehouseState", JSON.stringify(state));
  }, [state]);

  return (
    <WarehouseContext.Provider value={{ state, dispatch }}>
      {children}
    </WarehouseContext.Provider>
  );
};


const useWarehouseContext = () => {
  const context = useContext(WarehouseContext);
  if (!context) {
    throw new Error("useWarehouseContext must be used within a WarehouseProvider");
  }
  return context;
};

export { WarehouseProvider, useWarehouseContext };
