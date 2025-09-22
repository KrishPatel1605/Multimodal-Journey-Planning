import React, { useState, useEffect } from "react";
import { Clock, MapPin, Loader2, AlertCircle, ChevronDown, Check, Search, IndianRupee } from "lucide-react";

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

const calculateTotalFare = (itinerary) => {
  if (!itinerary.legs) return { min: 0, max: 0 };

  let minTotal = 0;
  let maxTotal = 0;

  itinerary.legs.forEach(leg => {
    if (leg.fares) {
      if (leg.mode === "RAIL" && leg.fares.secondClass && leg.fares.firstClass) {
        minTotal += leg.fares.secondClass;
        maxTotal += leg.fares.firstClass;
      } else if (leg.mode === "BUS" && leg.fares.nonAC && leg.fares.ac) {
        minTotal += leg.fares.nonAC;
        maxTotal += leg.fares.ac;
      } else if (leg.mode === "UBER" && leg.fares) {
        const uberFares = [leg.fares.auto, leg.fares.car, leg.fares.moto].filter(Boolean);
        if (uberFares.length > 0) {
          minTotal += Math.min(...uberFares);
          maxTotal += Math.max(...uberFares);
        }
      }
    }
  });

  return { min: minTotal, max: maxTotal };
};

const JourneyList = ({
  itineraries,
  loading,
  error,
  onRouteSelect,
  selectedRouteIndex = -1,
  onShowAllRoutes,
  hasSearched = false
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('recommended');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortedItineraries, setSortedItineraries] = useState([]);

  const sortOptions = {
    'recommended': 'Recommended',
    'duration-asc': 'Shortest Time',
    'transfers-asc': 'Fewest Transfers',
    'fare-asc': 'Lowest Fare',
  };

  useEffect(() => {
    if (!itineraries || itineraries.length === 0) {
      setSortedItineraries([]);
      return;
    }

    const sorted = [...itineraries].sort((a, b) => {
      switch (sortCriteria) {
        case 'duration-asc':
          return (a.duration || 0) - (b.duration || 0);
        case 'transfers-asc':
          const transfersA = (a.legs || []).filter(leg => leg.mode === 'RAIL' || leg.mode === 'BUS').length - 1;
          const transfersB = (b.legs || []).filter(leg => leg.mode === 'RAIL' || leg.mode === 'BUS').length - 1;
          const transferDiff = Math.max(0, transfersA) - Math.max(0, transfersB);
          return transferDiff !== 0 ? transferDiff : (a.duration || 0) - (b.duration || 0);
        case 'fare-asc':
          const fareA = calculateTotalFare(a);
          const fareB = calculateTotalFare(b);
          return fareA.min - fareB.min;
        case 'recommended':
        default:
          const scoreA = (a.duration || 0) / 60 + ((a.legs || []).filter(leg => leg.mode === 'RAIL' || leg.mode === 'BUS').length - 1) * 5;
          const scoreB = (b.duration || 0) / 60 + ((b.legs || []).filter(leg => leg.mode === 'RAIL' || leg.mode === 'BUS').length - 1) * 5;
          return scoreA - scoreB;
      }
    });

    setSortedItineraries(sorted);
  }, [itineraries, sortCriteria]);

  const handleReset = () => {
    setSortCriteria('recommended');
  };

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

  if (!sortedItineraries || sortedItineraries.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          {hasSearched ? (
            <>
              <Search className="h-8 w-8 mx-auto mb-4" />
              <p className="font-medium text-lg mb-2">No routes available</p>
              <p className="text-sm">
                No transit routes found between the selected locations.
                <br />
                Try adjusting your departure time or locations.
              </p>
            </>
          ) : (
            <>
              <MapPin className="h-8 w-8 mx-auto mb-4" />
              <p>Enter locations to find routes</p>
            </>
          )}
        </div>
      </div>
    );
  }

  const visibleItineraries = showAll ? sortedItineraries : sortedItineraries.slice(0, 3);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="sticky top-0 bg-white z-10 pb-4 border-b border-gray-100">
        <h1 className="text-center font-bold text-xl text-gray-800">Available Journeys</h1>
        <p className="text-center text-sm text-gray-600 mt-1">
          {sortedItineraries.length} Journey{sortedItineraries.length !== 1 ? "s" : ""} found
        </p>

        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reset
          </button>
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <span>
                Sort by: <span className="font-semibold">{sortOptions[sortCriteria]}</span>
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {Object.entries(sortOptions).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setSortCriteria(key);
                        setIsSortDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    >
                      {value}
                      {sortCriteria === key && <Check className="h-4 w-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 mt-4 pr-1">
        {visibleItineraries.map((itinerary, idx) => {
          const originalIndex = itineraries.findIndex(orig => orig === itinerary);
          const totalFare = calculateTotalFare(itinerary);

          return (
            <div
              key={idx}
              onClick={() => onRouteSelect && onRouteSelect(originalIndex)}
              className={`border rounded-2xl shadow-sm bg-white hover:shadow-md transition-all duration-200 cursor-pointer ${selectedRouteIndex === originalIndex
                ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-gray-800 text-lg">
                      Route {idx + 1}
                      {selectedRouteIndex === originalIndex && (
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
                    <div className="text-xs text-gray-500 mt-1">
                      {(() => {
                        const transfers = (itinerary.legs || []).filter(leg => leg.mode === 'RAIL' || leg.mode === 'BUS').length - 1;
                        return transfers > 0 ? `${transfers} transfer${transfers > 1 ? 's' : ''}` : 'Direct';
                      })()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {formatDuration(itinerary.duration)}
                    </div>
                    {totalFare.min > 0 && (
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        <span>
                          {`${totalFare.min}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {Array.isArray(itinerary.legs) &&
                    itinerary.legs.map((leg, lidx) => (
                      <JourneyLeg key={lidx} leg={leg} />
                    ))}
                </div>
              </div>
            </div>
          );
        })}

        {!showAll && sortedItineraries.length > 3 && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
          >
            Show {sortedItineraries.length - 3} More Routes
          </button>
        )}
      </div>
    </div>
  );
};

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

  const getMinUberFare = (fares) => {
    const uberFares = [fares.auto, fares.car, fares.moto].filter(Boolean);
    return uberFares.length > 0 ? Math.min(...uberFares) : null;
  };

  const style = getModeStyle(leg.mode);

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50 overflow-hidden">
      <button
        onClick={(e) => {
          e.stopPropagation();
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
          {leg.fares && (
            <div className="flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              <IndianRupee className="h-3 w-3" />
              <span>
                {leg.mode === "RAIL"
                  ? `${leg.fares.secondClass}`
                  : leg.mode === "BUS"
                    ? `${leg.fares.nonAC}`
                    : leg.mode === "UBER"
                      ? `${getMinUberFare(leg.fares)}`
                      : null
                }
              </span>
            </div>
          )}
        </div>
        <span className="text-gray-500 text-sm">
          {open ? "Hide Details" : "Show Details"}
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-200 bg-white">
          <div className="pt-4 space-y-3">
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

                {leg.fares && (
                  <div className="mt-3">
                    <p className="font-semibold text-gray-800 mb-2">Train Fares:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <p className="font-medium">Second Class</p>
                        <p className="text-green-600 flex items-center justify-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {leg.fares.secondClass}
                        </p>
                      </div>
                      <div className="bg-gray-100 p-2 rounded text-center">
                        <p className="font-medium">First Class</p>
                        <p className="text-green-600 flex items-center justify-center gap-1">
                          <IndianRupee className="h-3 w-3" />
                          {leg.fares.firstClass}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {leg.mode === "BUS" && leg.fares && (
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-2">Bus Fares:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-100 p-2 rounded text-center">
                    <p className="font-medium">Non-AC</p>
                    <p className="text-green-600 flex items-center justify-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {leg.fares.nonAC}
                    </p>
                  </div>
                  <div className="bg-gray-100 p-2 rounded text-center">
                    <p className="font-medium">AC</p>
                    <p className="text-green-600 flex items-center justify-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      {leg.fares.ac}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {leg.mode === "UBER" && leg.fares && (
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-2">Ride Options:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {leg.fares.auto && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Auto</p>
                      <p className="text-green-600 flex items-center justify-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {leg.fares.auto}
                      </p>
                    </div>
                  )}
                  {leg.fares.car && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Car</p>
                      <p className="text-green-600 flex items-center justify-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {leg.fares.car}
                      </p>
                    </div>
                  )}
                  {leg.fares.moto && (
                    <div className="bg-gray-100 p-2 rounded text-center">
                      <p className="font-medium">Moto</p>
                      <p className="text-green-600 flex items-center justify-center gap-1">
                        <IndianRupee className="h-3 w-3" />
                        {leg.fares.moto}
                      </p>
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