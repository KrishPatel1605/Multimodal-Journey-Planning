import React, { useState } from "react";

const formatTime = (ms) => {
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDuration = (seconds) => {
  const mins = Math.round(seconds / 60);
  return `${mins} min`;
};

const JourneyList = ({ itineraries }) => {
  const [showAll, setShowAll] = useState(false);

  if (!itineraries || itineraries.length === 0) {
    return <p className="text-gray-500">No routes found</p>;
  }

  // Slice itineraries: first 3 or all
  const visibleItineraries = showAll
    ? itineraries
    : itineraries.slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white z-10 pb-2">
        <h1 className="text-center font-bold text-lg">Available Journeys</h1>
      </div>

      {/* Scrollable Card List */}
      <div className="flex-1 overflow-y-auto space-y-4 mt-2 pr-1">
        {visibleItineraries.map((itinerary, idx) => (
          <div
            key={idx}
            className="border rounded-2xl shadow-md bg-white p-4"
          >
            {/* Card Header */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="font-semibold text-gray-800">
                  Journey {idx + 1}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTime(itinerary.startTime)} →{" "}
                  {formatTime(itinerary.endTime)}
                </p>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {formatDuration(itinerary.duration)}
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-2">
              {itinerary.legs.map((leg, lidx) => (
                <JourneyLeg key={lidx} leg={leg} />
              ))}
            </div>
          </div>
        ))}

        {/* Show More Button */}
        {!showAll && itineraries.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Show More Journeys
          </button>
        )}
      </div>
    </div>
  );
};

// Section for each leg
const JourneyLeg = ({ leg }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-xl bg-gray-50">
      {/* Section Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-3 py-2"
      >
        <div className="flex items-center gap-3">
          <span
            className="px-2 py-1 text-xs font-semibold text-white rounded-md"
            style={{
              backgroundColor:
                leg.mode === "UBER"
                  ? "#111827"
                  : leg.mode === "RAIL"
                  ? "#2563eb"
                  : leg.mode === "BUS"
                  ? "#059669"
                  : "#6b7280",
            }}
          >
            {leg.mode}
          </span>
          <span className="text-sm text-gray-700">
            {formatDuration(leg.duration)}
          </span>
        </div>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded Info */}
      {open && (
        <div className="px-3 pb-3 text-sm text-gray-600 border-t">
          <p>
            From: <span className="font-medium">{leg.from.name}</span>
          </p>
          <p>
            To: <span className="font-medium">{leg.to.name}</span>
          </p>
          {leg.route && (
            <p className="italic text-gray-500 mt-1">Route: {leg.route}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JourneyList;
