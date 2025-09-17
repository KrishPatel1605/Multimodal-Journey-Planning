import React, { useState } from "react";

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
              {Array.isArray(itinerary.legs) &&
                itinerary.legs.map((leg, lidx) => (
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

  if (!leg) return null; // safety check

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
                  : "#6b7280", // gray for walk
            }}
          >
            {leg.mode || "Unknown"}
          </span>
          <span className="text-sm text-gray-700">
            {formatDuration(leg.duration)}
          </span>
        </div>
        <span className="text-gray-500">{open ? "▲" : "▼"}</span>
      </button>

      {/* Expanded Info */}
      {open && (
        <div className="px-3 pb-3 text-sm text-gray-600 border-t space-y-2">
          {/* Default From/To */}
          <p>
            From: <span className="font-medium">{leg.from?.name}</span>
          </p>
          <p>
            To: <span className="font-medium">{leg.to?.name}</span>
          </p>
          {leg.route && leg.mode !== "RAIL" && (
            <p className="italic text-gray-500">Route: {leg.route}</p>
          )}

          {/* WALK details */}
          {leg.mode === "WALK" && Array.isArray(leg.steps) && (
            <div className="mt-2">
              <p className="font-semibold text-gray-700 mb-1">
                Walking Directions:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {leg.steps.map((step, sidx) => (
                  <li key={sidx} className="text-gray-600 text-sm">
                    {step.relativeDirection} on{" "}
                    <span className="font-medium">{step.streetName}</span> for{" "}
                    {Math.round(step.distance)}m
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TRAIN details */}
          {leg.mode === "RAIL" && (
            <div className="mt-2">
              {leg.startTime && leg.endTime && (
                <p className="text-sm text-gray-600">
                  Time:{" "}
                  <span className="font-medium">
                    {formatTime(leg.startTime)} → {formatTime(leg.endTime)}
                  </span>
                </p>
              )}

              <p className="font-semibold text-gray-700 mt-2">Train Details:</p>
              <ul className="list-disc list-inside space-y-1">
                {leg.agencyName && (
                  <li>
                    Operator:{" "}
                    <span className="font-medium">{leg.agencyName}</span>
                  </li>
                )}
                {leg.route && (
                  <li>
                    Line: <span className="font-medium">{leg.route}</span>
                  </li>
                )}
                {leg.trip?.tripId && (
                  <li>
                    Trip ID: <span className="font-medium">{leg.trip.tripId}</span>
                  </li>
                )}
                {leg.trip?.directionId !== undefined && (
                  <li>
                    Direction:{" "}
                    <span className="font-medium">{leg.trip.directionId}</span>
                  </li>
                )}
                {leg.headsign && (
                  <li>
                    Headsign: <span className="font-medium">{leg.headsign}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* UBER details */}
          {leg.mode === "UBER" && leg.fares && (
            <div className="mt-2">
              <p className="font-semibold text-gray-700 mb-1">Uber Options:</p>
              <ul className="list-disc list-inside space-y-1">
                {leg.fares.auto && (
                  <li>
                    Auto: <span className="font-medium">₹{leg.fares.auto}</span>
                  </li>
                )}
                {leg.fares.car && (
                  <li>
                    Car: <span className="font-medium">₹{leg.fares.car}</span>
                  </li>
                )}
                {leg.fares.moto && (
                  <li>
                    Moto: <span className="font-medium">₹{leg.fares.moto}</span>
                  </li>
                )}
              </ul>
              {leg.distance && (
                <p className="text-sm text-gray-600 mt-1">
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
      )}
    </div>
  );
};

export default JourneyList;
