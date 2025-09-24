import React, { useState, useEffect, useRef } from "react";
import { Clock, MapPin, Loader2, AlertCircle, ChevronDown, Check, Search, IndianRupee, ArrowRight } from "lucide-react";

// --- HELPER FUNCTIONS ---

// Storage keys
const STORAGE_KEYS = {
    SORT_CRITERIA: 'mumbai_transit_sort_criteria',
};

// Helper functions for localStorage
const saveToStorage = (key, value) => {
    try {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch (error) {
        console.warn('Failed to save to localStorage:', error);
    }
};

const loadFromStorage = (key, defaultValue) => {
    try {
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        }
    } catch (error) {
        console.warn('Failed to load from localStorage:', error);
    }
    return defaultValue;
};

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

// Calculate total fare for an itinerary
const calculateTotalFare = (itinerary) => {
    if (!itinerary || !itinerary.legs) return { min: 0, max: 0 };

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

// --- CHILD COMPONENTS ---

const LegDetails = ({ leg }) => {
    if (!leg) return null;

    return (
        <div className="text-sm text-gray-700 bg-white">
            <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2 border-t pt-4">
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-800">From:</span>
                        <span className="text-right">{leg.from?.name}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="font-medium text-gray-800">To:</span>
                        <span className="text-right">{leg.to?.name}</span>
                    </p>
                </div>

                {leg.route && leg.mode !== "RAIL" && (
                    <p className="italic text-gray-500">Route: {leg.route}</p>
                )}
                
                {leg.mode === "BUS" && leg.headsign && (
                    <p className="text-sm text-gray-700 bg-blue-50 px-3 py-2 rounded-lg">
                        <span className="font-medium text-blue-800">Towards:</span> {leg.headsign}
                    </p>
                )}
                
                {leg.mode === "WALK" && Array.isArray(leg.steps) && (
                    <div className="mt-4">
                        <p className="font-semibold text-gray-800 mb-2">Walking Directions:</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-2">
                            {leg.steps.map((step, sidx) => (
                                <div key={sidx} className="text-xs text-gray-600 pl-2 border-l-2 border-gray-300">
                                    {step.relativeDirection} on <span className="font-medium">{step.streetName}</span> for {Math.round(step.distance)}m
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {leg.mode === "RAIL" && (
                     <div className="mt-4 space-y-2">
                        {leg.fares && (
                            <div className="mt-3">
                                <p className="font-semibold text-gray-800 mb-2">Train Fares:</p>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                                        <p className="font-medium">Second Class</p>
                                        <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.secondClass}</p>
                                    </div>
                                    <div className="bg-gray-100 p-2 rounded-lg text-center">
                                        <p className="font-medium">First Class</p>
                                        <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.firstClass}</p>
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
                            <div className="bg-gray-100 p-2 rounded-lg text-center">
                                <p className="font-medium">Non-AC</p>
                                <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.nonAC}</p>
                            </div>
                            <div className="bg-gray-100 p-2 rounded-lg text-center">
                                <p className="font-medium">AC</p>
                                <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.ac}</p>
                            </div>
                        </div>
                    </div>
                )}

                {leg.mode === "UBER" && leg.fares && (
                    <div className="mt-4">
                        <p className="font-semibold text-gray-800 mb-2">Ride Options:</p>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                            {leg.fares.auto && (
                                <div className="bg-gray-100 p-2 rounded-lg text-center">
                                    <p className="font-medium">Auto</p>
                                    <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.auto}</p>
                                </div>
                            )}
                            {leg.fares.car && (
                                 <div className="bg-gray-100 p-2 rounded-lg text-center">
                                    <p className="font-medium">Car</p>
                                    <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.car}</p>
                                </div>
                            )}
                            {leg.fares.moto && (
                                <div className="bg-gray-100 p-2 rounded-lg text-center">
                                    <p className="font-medium">Moto</p>
                                    <p className="text-green-600 flex items-center justify-center gap-1 font-semibold"><IndianRupee className="h-3 w-3" />{leg.fares.moto}</p>
                                </div>
                            )}
                        </div>
                        {leg.distance && (
                            <p className="text-sm text-gray-600 mt-3">Distance: <span className="font-medium">{(leg.distance / 1000).toFixed(2)} km</span></p>
                        )}
                        {leg.duration && (
                            <p className="text-sm text-gray-600">Estimated Time: <span className="font-medium">{formatDuration(leg.duration)}</span></p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const JourneyCard = ({ itinerary, isSelected, onSelect }) => {
    const [expandedLegIndex, setExpandedLegIndex] = useState(null);

    if (!itinerary || !Array.isArray(itinerary.legs) || itinerary.legs.length === 0) return null;

    const totalFare = calculateTotalFare(itinerary);

    const startLocation = itinerary.legs[0]?.from?.name || 'Start';
    const endLocation = itinerary.legs[itinerary.legs.length - 1]?.to?.name || 'Destination';

    const getModeStyle = (mode) => {
        const styles = {
            UBER: { bg: "bg-black", text: "text-white", icon: "🚕" },
            RAIL: { bg: "bg-blue-600", text: "text-white", icon: "🚆" },
            BUS: { bg: "bg-emerald-500", text: "text-white", icon: "🚌" },
            WALK: { bg: "bg-gray-600", text: "text-white", icon: "🚶" },
            DEFAULT: { bg: "bg-gray-700", text: "text-white", icon: "📍" },
        };
        return styles[mode] || styles.DEFAULT;
    };

    const getMinLegFare = (leg) => {
        if (!leg.fares) return null;
        switch (leg.mode) {
            case "RAIL": return leg.fares.secondClass;
            case "BUS": return leg.fares.nonAC;
            case "UBER":
                const uberFares = [leg.fares.auto, leg.fares.car, leg.fares.moto].filter(Boolean);
                return uberFares.length > 0 ? Math.min(...uberFares) : null;
            default: return null;
        }
    };
    
    const handleLegClick = (e, index) => {
        e.stopPropagation();
        setExpandedLegIndex(prevIndex => prevIndex === index ? null : index);
    }

    return (
        <div
            onClick={onSelect}
            className={`border rounded-2xl shadow-sm bg-white hover:shadow-md transition-all duration-300 cursor-pointer ${
                isSelected
                    ? "border-blue-400 ring-2 ring-blue-100 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
            }`}
        >
            <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                        <p className="font-bold text-gray-800 text-lg truncate" title={`${startLocation} → ${endLocation}`}>
                           {startLocation} → {endLocation}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTime(itinerary.startTime)} — {formatTime(itinerary.endTime)}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            {formatDuration(itinerary.duration)}
                        </div>
                        {totalFare.min > 0 && (
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                <IndianRupee className="h-4 w-4" />
                                <span>{`${totalFare.min}`}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center">
                    {itinerary.legs.map((leg, index) => {
                        const style = getModeStyle(leg.mode);
                        const minFare = getMinLegFare(leg);

                        return (
                            <React.Fragment key={index}>
                                <button
                                    onClick={(e) => handleLegClick(e, index)}
                                    className={`flex-shrink-0 rounded-lg transition-all duration-300 ${style.bg} ${expandedLegIndex === index ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg' : 'shadow-sm'} w-20 h-28 flex flex-col overflow-hidden`}
                                >
                                    <div className={`flex-grow flex flex-col justify-center items-center p-1 text-center ${style.text}`}>
                                        <span className="text-3xl">{style.icon}</span>
                                        <p className="font-bold text-sm mt-1">{leg.mode}</p>
                                        <p className="text-xs opacity-90">{formatDuration(leg.duration)}</p>
                                    </div>
                                    <div className="w-full flex items-center justify-center gap-1 bg-black/25 text-white text-xs px-2 py-1 h-6 font-semibold">
                                        {minFare !== null ? (
                                            <>
                                                <IndianRupee className="h-3 w-3" />
                                                <span>{minFare}</span>
                                            </>
                                        ) : <span>&nbsp;</span>}
                                    </div>
                                </button>

                                {index < itinerary.legs.length - 1 && (
                                    <div className="px-2">
                                      <ArrowRight className="h-6 w-6 text-gray-300" />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
                
                <div className={`transition-all ease-in-out duration-500 overflow-hidden ${expandedLegIndex !== null ? 'max-h-[500px] opacity-100 pt-4' : 'max-h-0 opacity-0'}`}>
                   <LegDetails leg={itinerary.legs[expandedLegIndex]} />
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---

const JourneyList = ({
    itineraries,
    loading,
    error,
    onRouteSelect,
    selectedRouteIndex = -1,
    hasSearched = false
}) => {
    const [showAll, setShowAll] = useState(false);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [sortedItineraries, setSortedItineraries] = useState([]);
    const dropdownRef = useRef(null);

    const [sortCriteria, setSortCriteria] = useState(() => loadFromStorage(STORAGE_KEYS.SORT_CRITERIA, 'recommended'));

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.SORT_CRITERIA, sortCriteria);
    }, [sortCriteria]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsSortDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    const transfersA = (a.legs || []).length - 1;
                    const transfersB = (b.legs || []).length - 1;
                    return Math.max(0, transfersA) - Math.max(0, transfersB);
                case 'fare-asc':
                    return calculateTotalFare(a).min - calculateTotalFare(b).min;
                case 'recommended':
                default:
                    const scoreA = (a.duration || 0) + ((a.legs || []).length - 1) * 300;
                    const scoreB = (b.duration || 0) + ((b.legs || []).length - 1) * 300;
                    return scoreA - scoreB;
            }
        });

        setSortedItineraries(sorted);
    }, [itineraries, sortCriteria]);

    const handleReset = () => {
        setSortCriteria('recommended');
    };

    const handleSortChange = (newSortCriteria) => {
        setSortCriteria(newSortCriteria);
        setIsSortDropdownOpen(false);
    };

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600">Finding best routes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
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
            <div className="w-full h-full flex items-center justify-center p-4">
                <div className="text-center text-gray-500">
                    {hasSearched ? (
                        <>
                            <Search className="h-10 w-10 mx-auto mb-4" />
                            <p className="font-semibold text-lg mb-2">No routes available</p>
                            <p className="text-sm">No transit routes found. Try adjusting your departure time or locations.</p>
                        </>
                    ) : (
                        <>
                            <MapPin className="h-10 w-10 mx-auto mb-4" />
                            <p>Enter locations to find routes</p>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const visibleItineraries = showAll ? sortedItineraries : sortedItineraries.slice(0, 3);

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 p-4">
            <div className="sticky top-0 bg-gray-50 z-10 pb-4">
                <h1 className="text-center font-bold text-xl text-gray-800">Available Journeys</h1>
                <p className="text-center text-sm text-gray-600 mt-1">
                    {sortedItineraries.length} Journey{sortedItineraries.length !== 1 ? "s" : ""} found
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-sm"
                    >
                        Reset
                    </button>
                     <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 shadow-sm"
                        >
                            <span>Sort by: <span className="font-semibold">{sortOptions[sortCriteria]}</span></span>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isSortDropdownOpen ? 'rotate-180': ''}`} />
                        </button>
                        {isSortDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 origin-top-right animate-scale-in">
                                <div className="py-1">
                                    {Object.entries(sortOptions).map(([key, value]) => (
                                        <button
                                            key={key}
                                            onClick={() => handleSortChange(key)}
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

            <div className="flex-1 overflow-y-auto space-y-4 mt-2 pr-1 pb-4">
                {visibleItineraries.map((itinerary, idx) => {
                    const originalIndex = itineraries.findIndex(orig => orig === itinerary);
                    return (
                       <JourneyCard 
                            key={idx}
                            itinerary={itinerary}
                            isSelected={selectedRouteIndex === originalIndex}
                            onSelect={() => onRouteSelect && onRouteSelect(originalIndex)}
                       />
                    );
                })}

                {!showAll && sortedItineraries.length > 3 && (
                    <button
                        onClick={() => setShowAll(true)}
                        className="w-full py-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-all duration-200 font-medium shadow-sm"
                    >
                        Show {sortedItineraries.length - 3} More Routes
                    </button>
                )}
            </div>
        </div>
    );
};


export default JourneyList;