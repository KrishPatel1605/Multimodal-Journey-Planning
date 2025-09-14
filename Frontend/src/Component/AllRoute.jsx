import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react"; // npm install lucide-react

const AllRoute = () => {
  const suggestedRoutes = [
    { name: "Walking", info: "Best for short distances, eco-friendly." },
    { name: "Bus", info: "Affordable public transport, available in cities." },
    { name: "Train", info: "Good for long distances, comfortable seating." },
  ];

  const allRoutes = [
    { name: "Walking", info: "Best for short distances, eco-friendly." },
    { name: "Bus", info: "Affordable public transport, available in cities." },
    { name: "Train", info: "Good for long distances, comfortable seating." },
    { name: "Metro", info: "Fast underground transport, common in metros." },
    { name: "Cab", info: "Convenient but more expensive than bus." },
    { name: "Cycle", info: "Healthy and eco-friendly for short commutes." },
    { name: "Carpool", info: "Share rides, reduce costs and pollution." },
    { name: "Auto", info: "Affordable local transport option." },
    { name: "Ferry", info: "Water transport, scenic and relaxing." },
    { name: "Tram", info: "Electric street transport in some cities." },
  ];

  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (key) => {
    setExpanded(expanded === key ? null : key);
  };

  return (
    <div className="w-1/2 h-screen m-6">
      <div className="h-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 overflow-hidden">
        {/* Scrollable content inside */}
        <div className="h-full overflow-y-auto pr-2">
          {/* Suggested Routes */}
          <h2 className="font-semibold mb-3 text-gray-800">Suggested Routes</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 shadow-sm">
            {suggestedRoutes.map((route, idx) => {
              const key = `suggested-${idx}`;
              return (
                <div key={key} className="px-4 py-3 hover:bg-gray-50 transition">
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleExpand(key)}
                  >
                    <span className="text-gray-700 font-medium">{route.name}</span>
                    {expanded === key ? (
                      <ChevronDown size={18} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-500" />
                    )}
                  </button>

                  {/* Smooth Expand/Collapse */}
                  <div
                    className={`mt-2 text-sm text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${
                      expanded === key
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {route.info}
                  </div>
                </div>
              );
            })}
          </div>

          {/* All Routes */}
          <h2 className="font-semibold mt-6 mb-3 text-gray-800">All Routes</h2>
          <div className="border border-gray-200 rounded-xl divide-y divide-gray-200 shadow-sm">
            {allRoutes.map((route, idx) => {
              const key = `all-${idx}`;
              return (
                <div key={key} className="px-4 py-3 hover:bg-gray-50 transition">
                  <button
                    className="w-full flex justify-between items-center text-left"
                    onClick={() => toggleExpand(key)}
                  >
                    <span className="text-gray-700 font-medium">{route.name}</span>
                    {expanded === key ? (
                      <ChevronDown size={18} className="text-gray-500" />
                    ) : (
                      <ChevronRight size={18} className="text-gray-500" />
                    )}
                  </button>

                  {/* Smooth Expand/Collapse */}
                  <div
                    className={`mt-2 text-sm text-gray-600 overflow-hidden transition-all duration-300 ease-in-out ${
                      expanded === key
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {route.info}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRoute;
