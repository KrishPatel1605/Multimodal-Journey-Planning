import React, { useState, useEffect } from "react";
import { 
  ArrowUpDown, 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Train, 
  Car, 
  Navigation, 
  Bus,
  Search,
  Route,
  Zap
} from "lucide-react";

// Sample data - in a real app, this would be imported from your assets
const sampleTrainData = {
  "plan": {
    "itineraries": [
      {
        "duration": 2400,
        "startTime": 1638360000000,
        "endTime": 1638362400000,
        "legs": [
          {
            "mode": "WALK",
            "duration": 300,
            "from": { "name": "Bandra Station Entrance", "lat": 19.0544, "lon": 72.8406 },
            "to": { "name": "Bandra Railway Station", "lat": 19.0544, "lon": 72.8406 },
            "steps": [
              { "relativeDirection": "Continue", "streetName": "Station Road", "distance": 150 }
            ]
          },
          {
            "mode": "RAIL",
            "duration": 1800,
            "startTime": 1638360300000,
            "endTime": 1638362100000,
            "from": { "name": "Bandra", "lat": 19.0544, "lon": 72.8406 },
            "to": { "name": "Andheri", "lat": 19.1197, "lon": 72.8464 },
            "route": "Western Line",
            "headsign": "Virar",
            "agencyName": "Western Railway"
          },
          {
            "mode": "WALK",
            "duration": 300,
            "from": { "name": "Andheri Railway Station", "lat": 19.1197, "lon": 72.8464 },
            "to": { "name": "Andheri Metro Station", "lat": 19.1197, "lon": 72.8464 },
            "steps": [
              { "relativeDirection": "Turn right", "streetName": "Station Bridge", "distance": 100 }
            ]
          }
        ]
      },
      {
        "duration": 3000,
        "startTime": 1638360600000,
        "endTime": 1638363600000,
        "legs": [
          {
            "mode": "UBER",
            "duration": 2400,
            "from": { "name": "Bandra West", "lat": 19.0596, "lon": 72.8295 },
            "to": { "name": "Andheri East", "lat": 19.1136, "lon": 72.8697 },
            "distance": 18500,
            "fares": {
              "auto": 120,
              "car": 280,
              "moto": 95
            }
          },
          {
            "mode": "WALK",
            "duration": 600,
            "from": { "name": "Drop Point", "lat": 19.1136, "lon": 72.8697 },
            "to": { "name": "Final Destination", "lat": 19.1197, "lon": 72.8464 },
            "steps": [
              { "relativeDirection": "Head north", "streetName": "Main Road", "distance": 300 }
            ]
          }
        ]
      }
    ]
  }
};

// Enhanced Input Layout Component
const InputLayout = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSuggestions = async (query, setFn) => {
    if (query.length < 3) {
      setFn([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ", Mumbai")}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setFn(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSelectedFrom(selectedTo);
    setSelectedTo(selectedFrom);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleSearch = async () => {
    if (!from || !to) {
      alert("Please enter both starting and destination locations");
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSearch(sampleTrainData.plan.itineraries);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Route className="w-7 h-7 text-blue-600" />
          Plan Your Journey
        </h2>
        <p className="text-gray-500 text-sm mt-1">Find the best routes across Mumbai</p>
      </div>

      <div className="relative">
        {/* FROM Input */}
        <div className="relative mb-4">
          <div className="flex items-center space-x-4 group">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg group-focus-within:scale-110 transition-transform"></div>
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setSelectedFrom(null);
                fetchSuggestions(e.target.value, setFromSuggestions);
              }}
              className="flex-1 border-2 border-gray-200 px-4 py-4 rounded-xl focus:outline-none focus:border-green-500 focus:bg-green-50/30 transition-all placeholder-gray-400 text-gray-800 font-medium"
              placeholder="Starting location"
            />
          </div>

          {fromSuggestions.length > 0 && (
            <ul className="absolute left-8 right-0 bg-white border-2 border-gray-200 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-2xl z-30">
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFrom(suggestion.display_name);
                    setSelectedFrom(suggestion);
                    setFromSuggestions([]);
                  }}
                  className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
                >
                  <div className="font-medium text-gray-800">{suggestion.display_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative z-20 -my-2">
          <button
            onClick={handleSwap}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          >
            <ArrowUpDown className="h-5 w-5" />
          </button>
        </div>

        {/* TO Input */}
        <div className="relative mt-4">
          <div className="flex items-center space-x-4 group">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg group-focus-within:scale-110 transition-transform"></div>
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setSelectedTo(null);
                fetchSuggestions(e.target.value, setToSuggestions);
              }}
              className="flex-1 border-2 border-gray-200 px-4 py-4 rounded-xl focus:outline-none focus:border-red-500 focus:bg-red-50/30 transition-all placeholder-gray-400 text-gray-800 font-medium"
              placeholder="Destination"
            />
          </div>

          {toSuggestions.length > 0 && (
            <ul className="absolute left-8 right-0 bg-white border-2 border-gray-200 rounded-xl mt-2 max-h-48 overflow-y-auto shadow-2xl z-30">
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setTo(suggestion.display_name);
                    setSelectedTo(suggestion);
                    setToSuggestions([]);
                  }}
                  className="px-4 py-3 text-sm hover:bg-red-50 cursor-pointer transition-colors border-b last:border-b-0 border-gray-100"
                >
                  <div className="font-medium text-gray-800">{suggestion.display_name}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 transition-all duration-200 flex items-center justify-center gap-3"
      >
        {isSearching ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Searching Routes...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            FIND BEST ROUTES
          </>
        )}
      </button>
    </div>
  );
};

// Utility functions
const formatTime = (ms) => {
  if (!ms) return "--";
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds) => {
  if (!seconds) return "--";
  const mins = Math.round(seconds / 60);
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }
  return `${mins}m`;
};

const getModeIcon = (mode) => {
  switch (mode) {
    case "UBER": return <Car className="w-4 h-4" />;
    case "RAIL": return <Train className="w-4 h-4" />;
    case "BUS": return <Bus className="w-4 h-4" />;
    case "WALK": return <Navigation className="w-4 h-4" />;
    default: return <MapPin className="w-4 h-4" />;
  }
};

const getModeColor = (mode) => {
  switch (mode) {
    case "UBER": return "bg-black text-white";
    case "RAIL": return "bg-blue-600 text-white";
    case "BUS": return "bg-orange-600 text-white";
    case "WALK": return "bg-green-600 text-white";
    default: return "bg-gray-500 text-white";
  }
};

// Enhanced Journey List Component
const JourneyList = ({ itineraries, isLoading }) => {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Finding best routes...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
          </div>
        </div>
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-medium">No routes found</p>
            <p className="text-gray-400 text-sm mt-2">Try searching with different locations</p>
          </div>
        </div>
      </div>
    );
  }

  const visibleItineraries = showAll ? itineraries : itineraries.slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white z-10 px-6 py-5 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6 text-yellow-300" />
          <h1 className="font-bold text-xl">Route Options</h1>
        </div>
        <p className="text-blue-100 text-sm">
          {itineraries.length} route{itineraries.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Scrollable Card List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {visibleItineraries.map((itinerary, idx) => (
          <RouteCard key={idx} itinerary={itinerary} index={idx} />
        ))}

        {!showAll && itineraries.length > 3 && (
          <div className="text-center py-4">
            <button
              onClick={() => setShowAll(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Show {itineraries.length - 3} More Routes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Route Card Component
const RouteCard = ({ itinerary, index }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-white to-gray-50 p-6 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Option {index + 1}
              </div>
              <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  {formatDuration(itinerary.duration)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xl">
              <span className="font-bold text-gray-800">
                {formatTime(itinerary.startTime)}
              </span>
              <div className="flex-1 border-t-3 border-dashed border-gray-300 relative">
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 w-3 h-3 rounded-full shadow-lg"></div>
              </div>
              <span className="font-bold text-gray-800">
                {formatTime(itinerary.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Legs */}
      <div className="p-6 space-y-4">
        {Array.isArray(itinerary.legs) &&
          itinerary.legs.map((leg, lidx) => (
            <JourneyLeg key={lidx} leg={leg} isLast={lidx === itinerary.legs.length - 1} />
          ))}
      </div>
    </div>
  );
};

// Enhanced Journey Leg Component
const JourneyLeg = ({ leg, isLast }) => {
  const [open, setOpen] = useState(false);

  if (!leg) return null;

  return (
    <div className={`border-l-4 ${!isLast ? 'border-gray-200' : 'border-transparent'} ${!isLast ? 'pb-4' : ''}`}>
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
        {/* Section Header */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex justify-between items-center p-5"
        >
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${getModeColor(leg.mode)}`}>
              {getModeIcon(leg.mode)}
              <span>{leg.mode || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-semibold">{formatDuration(leg.duration)}</span>
            </div>
          </div>
          {open ? (
            <ChevronUp className="w-6 h-6 text-gray-400" />
          ) : (
            <ChevronDown className="w-6 h-6 text-gray-400" />
          )}
        </button>

        {/* Expanded Info */}
        {open && (
          <div className="px-5 pb-5 border-t border-gray-200 bg-white">
            <div className="pt-5 space-y-5">
              {/* From/To with enhanced design */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg"></div>
                  <div className="w-1 h-12 bg-gradient-to-b from-green-300 to-red-300"></div>
                  <div className="w-4 h-4 bg-gradient-to-r from-red-400 to-red-600 rounded-full shadow-lg"></div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-green-600 font-semibold mb-1">From</p>
                    <p className="font-bold text-gray-800">{leg.from?.name}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600 font-semibold mb-1">To</p>
                    <p className="font-bold text-gray-800">{leg.to?.name}</p>
                  </div>
                </div>
              </div>

              {/* Mode-specific details with enhanced styling */}
              {leg.mode === "WALK" && Array.isArray(leg.steps) && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Navigation className="w-6 h-6 text-green-700" />
                    <h4 className="font-bold text-green-800 text-lg">Walking Directions</h4>
                  </div>
                  <ul className="space-y-3">
                    {leg.steps.map((step, sidx) => (
                      <li key={sidx} className="flex items-start gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 shadow-lg"></div>
                        <div className="text-sm text-green-800">
                          <span className="font-bold">{step.relativeDirection}</span> on{" "}
                          <span className="font-bold">{step.streetName}</span>
                          <span className="text-green-600 bg-green-200 px-2 py-1 rounded-full ml-2 text-xs">
                            {Math.round(step.distance)}m
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {leg.mode === "RAIL" && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Train className="w-6 h-6 text-blue-700" />
                    <h4 className="font-bold text-blue-800 text-lg">Train Journey</h4>
                  </div>
                  
                  {leg.startTime && leg.endTime && (
                    <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-bold text-lg">
                          {formatTime(leg.startTime)} → {formatTime(leg.endTime)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {leg.agencyName && (
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-blue-600 font-semibold">Operator:</span>
                        <span className="font-bold text-blue-800">{leg.agencyName}</span>
                      </div>
                    )}
                    {leg.route && (
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-blue-600 font-semibold">Line:</span>
                        <span className="font-bold text-blue-800">{leg.route}</span>
                      </div>
                    )}
                    {leg.headsign && (
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-blue-600 font-semibold">Direction:</span>
                        <span className="font-bold text-blue-800">{leg.headsign}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {leg.mode === "UBER" && leg.fares && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Car className="w-6 h-6 text-gray-700" />
                    <h4 className="font-bold text-gray-800 text-lg">Ride Options</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3 mb-4">
                    {leg.fares.auto && (
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
                        <span className="text-gray-600 font-semibold">🛺 Auto</span>
                        <span className="font-bold text-green-600 text-lg">₹{leg.fares.auto}</span>
                      </div>
                    )}
                    {leg.fares.car && (
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
                        <span className="text-gray-600 font-semibold">🚗 Car</span>
                        <span className="font-bold text-green-600 text-lg">₹{leg.fares.car}</span>
                      </div>
                    )}
                    {leg.fares.moto && (
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg border shadow-sm">
                        <span className="text-gray-600 font-semibold">🏍️ Moto</span>
                        <span className="font-bold text-green-600 text-lg">₹{leg.fares.moto}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600 bg-white p-3 rounded-lg">
                    {leg.distance && (
                      <span className="font-semibold">Distance: {(leg.distance / 1000).toFixed(2)} km</span>
                    )}
                    {leg.duration && (
                      <span className="font-semibold">Est. Time: {formatDuration(leg.duration)}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Map Placeholder (since we can't import the actual Leaflet map)
const MapPlaceholder = ({ itineraries }) => {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
      <div className="text-center">
        <MapPin className="w-20 h-20 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-600 mb-2">Interactive Map</h3>
        <p className="text-gray-500">Route visualization would appear here</p>
        {itineraries && itineraries.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            <p>Showing {itineraries.length} route{itineraries.length !== 1 ? 's' : ''}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
const TransportApp = () => {
  const [itineraries, setItineraries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (searchResults) => {
    setIsLoading(true);
    setTimeout(() => {
      setItineraries(searchResults);
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 h-full w-1/3 max-w-md">
        {/* Input Section */}
        <div className="flex-shrink-0">
          <InputLayout onSearch={handleSearch} />
        </div>
        
        {/* Results Section */}
        <div className="flex-1 rounded-2xl overflow-hidden shadow-xl">
          <JourneyList itineraries={itineraries} isLoading={isLoading} />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 ml-6 bg-white rounded-2xl shadow-xl border border-gray-200 p-4">
        <MapPlaceholder itineraries={itineraries} />
      </div>
    </div>
  );
};

export default TransportApp;