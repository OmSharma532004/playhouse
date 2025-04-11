// DonutCharts.js
import DonutChart from "react-donut-chart";
import "./donut.css";

const PercentageDonutChart = ({ percentage, label1 }) => {
  const scaledPercentage = Math.min(Math.max(0, percentage ), 100);
  const remainingPercentage = 100 - scaledPercentage;

  const data = [
    { label: label1, value: scaledPercentage, className: "filled" },
    { label: "Remaining", value: remainingPercentage, className: "remaining" },
  ];

  return <DonutChart data={data} />;
};

export { PercentageDonutChart };
