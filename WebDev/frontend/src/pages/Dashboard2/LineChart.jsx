import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map((entry) => new Date(entry.timestamp).toLocaleTimeString()), 
    datasets: [
      {
        label: 'Spoilage Percentage Over Time',
        data: data.map((entry) => entry.spoilage), 
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4, 
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        beginAtZero: true,
        max: 100, 
        title: {
          display: true,
          text: 'Spoilage (%)',
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-center text-lg font-semibold text-gray-500 mb-4">
        Spoilage Over Time
      </h3>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
