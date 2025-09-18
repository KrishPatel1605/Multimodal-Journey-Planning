import React, { useState } from "react";
import { Clock, MapPin, Loader2, AlertCircle, Map } from "lucide-react";

const formatTime = (ms) => {
  if (!ms) return "--";
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds) => {
  if (!seconds) return "--";
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
};

const JourneyList = ({ 
  itineraries, 
  loading, 
  error, 
  onRouteSelect,
  selectedRouteIndex = -1,
  onShowAllRoutes
}) => {
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-600">Finding best routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertCircle className="h-8 w-8 mx-auto mb-4" />
          <p className="font-medium">Error loading routes</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!itineraries || itineraries.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-4" />
          <p>Enter locations to find routes</p>
        </div>
      </div>
    );
  }

  const visibleItineraries = showAll ? itineraries : itineraries.slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
        <h1 className="text-center font-bold text-xl text-gray-800">Available Routes</h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          {itineraries.length} route{itineraries.length !== 1 ? "s" : ""} found
        </p>

        {/* Show All Routes Button */}
        {/* {selectedRouteIndex !== -1 && onShowAllRoutes && (
          <div className="mt-3 flex justify-center">
            <button
              onClick={onShowAllRoutes}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
            >
              <Map className="h-4 w-4" />
              <span>Show All Routes</span>
            </button>
          </div>
        )} */}
      </div>

      {/* Scrollable Card List */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1">
        {visibleItineraries.map((itinerary, idx) => (
          <div
            key={idx}
            onClick={() => onRouteSelect && onRouteSelect(idx)} // whole card clickable
            className={`border rounded-2xl shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer ${
              selectedRouteIndex === idx
                ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* Card Header */}
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">
                    Route {idx + 1}
                    {selectedRouteIndex === idx && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                        Selected
                      </span>
                    )}
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formatTime(itinerary.startTime)} → {formatTime(itinerary.endTime)}
                    </span>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {formatDuration(itinerary.duration)}
                </div>
              </div>

              {/* Sections */}
              <div className="space-y-3">
                {Array.isArray(itinerary.legs) &&
                  itinerary.legs.map((leg, lidx) => (
                    <JourneyLeg key={lidx} leg={leg} />
                  ))}
              </div>
            </div>
          </div>
        ))}

        {/* Show More Button */}
        {!showAll && itineraries.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            Show {itineraries.length - 3} More Routes
          </button>
        )}
      </div>
    </div>
  );
};

// Section for each leg
const JourneyLeg = ({ leg }) => {
  const [open, setOpen] = useState(false);

  if (!leg) return null;

  const getModeStyle = (mode) => {
    const styles = {
      UBER: { bg: "#000000", text: "white", icon: "🚖" },
      RAIL: { bg: "#2563eb", text: "white", icon: "🚆" },
      BUS: { bg: "#059669", text: "white", icon: "🚌" },
      WALK: { bg: "#6b7280", text: "white", icon: "🚶" },
      DEFAULT: { bg: "#374151", text: "white", icon: "📍" },
    };
    return styles[mode] || styles.DEFAULT;
  };

  const style = getModeStyle(leg.mode);

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
      {/* Section Header */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent triggering card click
          setOpen(!open);
        }}
        className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="px-3 py-1 text-sm font-semibold rounded-full flex items-center space-x-1"
            style={{ backgroundColor: style.bg, color: style.text }}
          >
            <span>{style.icon}</span>
            <span>{leg.mode || "Unknown"}</span>
          </span>
          <span className="text-sm text-gray-700 font-medium">
            {formatDuration(leg.duration)}
          </span>
        </div>
        <span className="text-gray-500 text-sm">
          {open ? "Hide Details" : "Show Details"}
        </span>
      </button>

      {/* Expanded Info */}
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-200 bg-white">
          <div className="pt-4 space-y-3">
            {/* Default From/To */}
            <div className="grid grid-cols-1 gap-2">
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">From:</span>
                <span className="text-right">{leg.from?.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-gray-700">To:</span>
                <span className="text-right">{leg.to?.name}</span>
              </p>
            </div>

            {leg.route && leg.mode !== "RAIL" && (
              <p className="italic text-gray-500">Route: {leg.route}</p>
            )}

            {/* WALK details */}
            {leg.mode === "WALK" && Array.isArray(leg.steps) && (
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-2">Walking Directions:</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {leg.steps.map((step, sidx) => (
                    <div
                      key={sidx}
                      className="text-xs text-gray-600 pl-2 border-l-2 border-gray-200"
                    >
                      {step.relativeDirection} on{" "}
                      <span className="font-medium">{step.streetName}</span> for{" "}
                      {Math.round(step.distance)}m
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TRAIN details */}
            {leg.mode === "RAIL" && (
              <div className="mt-4 space-y-2">
                {leg.startTime && leg.endTime && (
                  <p className="text-sm text-gray-600">
                    Time:{" "}
                    <span className="font-medium">
                      {formatTime(leg.startTime)} → {formatTime(leg.endTime)}
                    </span>
                  </p>
                )}

                <p className="font-semibold text-gray-800">Train Details:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  {leg.agencyName && (
                    <p>
                      <span className="font-medium">Operator:</span>{" "}
                      {leg.agencyName}
                    </p>
                  )}
                  {leg.route && (
                    <p>
                      <span className="font-medium">Line:</span> {leg.route}
                    </p>
                  )}
                  {leg.trip?.tripId && (
                    <p>
                      <span className="font-medium">Trip ID:</span>{" "}
                      {leg.trip.tripId}
                    </p>
                  )}
                  {leg.trip?.directionId !== undefined && (
                    <p>
                      <span className="font-medium">Direction:</span>{" "}
                      {leg.trip.directionId}
                    </p>
                  )}
                  {leg.headsign && (
                    <p>
                      <span className="font-medium">Headsign:</span>{" "}
                      {leg.headsign}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* UBER details */}
            {leg.mode === "UBER" && leg.fares && (
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-2">Ride Options:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {leg.fares.auto && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Auto</p>
                      <p className="text-green-600">₹{leg.fares.auto}</p>
                    </div>
                  )}
                  {leg.fares.car && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Car</p>
                      <p className="text-green-600">₹{leg.fares.car}</p>
                    </div>
                  )}
                  {leg.fares.moto && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Moto</p>
                      <p className="text-green-600">₹{leg.fares.moto}</p>
                    </div>
                  )}
                </div>
                {leg.distance && (
                  <p className="text-sm text-gray-600 mt-2">
                    Distance:{" "}
                    <span className="font-medium">
                      {(leg.distance / 1000).toFixed(2)} km
                    </span>
                  </p>
                )}
                {leg.duration && (
                  <p className="text-sm text-gray-600">
                    Estimated Time:{" "}
                    <span className="font-medium">
                      {formatDuration(leg.duration)}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JourneyList;
