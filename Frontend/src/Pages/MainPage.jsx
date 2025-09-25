import React, { useState } from "react";
import InputLayout from "../Component/InputLayout";
import MapLeaflet from "../Component/MapLeaflet";
import JourneyList from "../Component/JourneyList";

const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    setSelectedRoute(null);
    setHasSearched(true);
    
    try {
      console.log("Sending search request:", searchData);

      const requestPayload = {
        start: searchData.start,
        destination: searchData.destination,
        transportModes: searchData.transportModes
      };

      const response = await fetch("http://localhost:5000/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received route data:", data);

      if (data.plan?.itineraries) {
        setRoutes(data.plan.itineraries);
      } else {
        setRoutes([]);
        setError("No routes found for the selected locations and transport modes");
      }
    } catch (err) {
      console.error("Error fetching routes:", err);
      setError(`Failed to fetch routes: ${err.message}`);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRouteSelect = (routeIndex) => {
    if (routes[routeIndex]) {
      setSelectedRoute(routes[routeIndex]);
    }
  };

  const handleShowAllRoutes = () => {
    setSelectedRoute(null);
  };

  const handleResetSearch = () => {
    setRoutes([]);
    setError(null);
    setSelectedRoute(null);
    setHasSearched(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="flex flex-col h-full w-[60%] bg-white shadow-lg border border-gray-100 overflow-hidden mr-6">
        <div className="p-3 border-b border-gray-200">
          <InputLayout onSearch={handleSearch} loading={loading} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 pt-2">
          <MapLeaflet
            height="100%"
            zoom={12}
            routes={selectedRoute ? [selectedRoute] : routes}
            selectedRoute={selectedRoute}
            showAllRoutes={!selectedRoute}
          />
        </div>
      </div>

      <div className="w-[60%]">
        <JourneyList
          itineraries={routes}
          loading={loading}
          error={error}
          onRouteSelect={handleRouteSelect}
          selectedRouteIndex={selectedRoute ? routes.indexOf(selectedRoute) : -1}
          onShowAllRoutes={handleShowAllRoutes}
          hasSearched={hasSearched}
        />
      </div>
    </div>
  );
};

export default MainPage;