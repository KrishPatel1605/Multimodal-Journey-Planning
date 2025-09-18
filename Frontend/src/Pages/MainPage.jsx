import React, { useState } from "react";
import InputLayout from "../Component/InputLayout";
import MapLeaflet from "../Component/MapLeaflet";
import JourneyList from "../Component/JourneyList";

const MainPage = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setError(null);
    setSelectedRoute(null); // Reset selected route on new search
    
    try {
      console.log('Sending search request:', searchData);
      
      const response = await fetch('http://localhost:5000/api/routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received route data:', data);
      
      if (data.plan?.itineraries) {
        setRoutes(data.plan.itineraries);
      } else {
        setRoutes([]);
        setError('No routes found for the selected locations');
      }
    } catch (err) {
      console.error('Error fetching routes:', err);
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

  return (
    <div className="flex h-screen bg-gray-50 p-6 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 h-full w-96">
        {/* Top Card - Search Input */}
        <div className="rounded-2xl">
          <InputLayout onSearch={handleSearch} loading={loading} />
        </div>
        
        {/* Bottom Card - Journey List */}
        <div className="rounded-2xl flex-1 bg-white shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-full p-6">
            <JourneyList 
              itineraries={routes} 
              loading={loading} 
              error={error}
              onRouteSelect={handleRouteSelect}
              selectedRouteIndex={selectedRoute ? routes.indexOf(selectedRoute) : -1}
              onShowAllRoutes={handleShowAllRoutes}
            />
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 ml-6">
        <MapLeaflet 
          height="100%" 
          zoom={12} 
          routes={selectedRoute ? [selectedRoute] : routes}
          selectedRoute={selectedRoute}
          showAllRoutes={!selectedRoute}
        />
      </div>
    </div>
  );
};

export default MainPage;