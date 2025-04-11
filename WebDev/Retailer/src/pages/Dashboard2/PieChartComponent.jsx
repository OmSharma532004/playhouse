import React from 'react';
import { Pie } from 'react-chartjs-2';

const PieChartComponent = ({ spoilage }) => {
  const data = {
    labels: ['Spoilage', 'No Spoilage'],
    datasets: [
      {
        data: [spoilage, 100 - spoilage],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-gray-500 mb-4">
        Spoilage Prediction
      </h3>
      <Pie data={data} />
      <p className="text-center mt-4 text-gray-600">
        {spoilage}% chance of spoilage
      </p>
    </div>
  );
};

export default PieChartComponent;
