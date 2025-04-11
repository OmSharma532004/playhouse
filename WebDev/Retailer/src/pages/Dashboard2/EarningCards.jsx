import React from 'react';

const EarningsCard = ({ title, number, change, onIncrement, onDecrement }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600 mb-2">{number}</p>
      {/* <p className="text-sm text-gray-400 mb-4">Change: {change}%</p> */}
      <div className="flex space-x-2">
        <button
          onClick={onIncrement}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          +
        </button>
        <button
          onClick={onDecrement}
          className="px-3 py-1 bg-red-500 text-white rounded-md"
        >
          -
        </button>
      </div>
    </div>
  );
};

export default EarningsCard;
