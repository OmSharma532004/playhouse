// Rightbar.js
import React from "react";

const Rightbar = () => {
  return (
    <div className="w-80 bg-gray-900 text-white p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <ul className="text-sm space-y-2">
          <li>Adjust Ventilation, Activate Cooling Systems</li>
          <li>Enhance Ventilation, Dehumidification Systems</li>
          <li>Ventilation Improvement, Inert Gas Injection</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Improve</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Adjust Ventilation:</h4>
            <p className="text-sm">
              If possible, increase ventilation to promote air circulation and
              help dissipate heat. Adequate ventilation is essential for
              preventing the formation of hotspots within the storage.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Inert Gas Injection:</h4>
            <p className="text-sm">
              Consider the injection of inert gases, such as nitrogen or carbon
              dioxide, into the storage environment. Inert gases displace oxygen
              and create an atmosphere less conducive to combustion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
