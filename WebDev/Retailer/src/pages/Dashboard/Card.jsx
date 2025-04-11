// Card.js
import React from "react";

const Card = ({ item }) => {
  return (
    <div className="bg-white shadow-md rounded p-4 flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
      <p className="text-2xl font-bold">{item.number}</p>
      <span className={`text-sm ${item.change > 0 ? "text-green-500" : "text-red-500"}`}>
        {item.change > 0 ? "+" : ""}
        {item.change}%
      </span>
    </div>
  );
};

export default Card;
