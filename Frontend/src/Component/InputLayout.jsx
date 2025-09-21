import { useState, useEffect } from "react";
import { ArrowUpDown, Navigation, Loader2, MapPin, Train, Bus, ChevronDown, Check } from "lucide-react";

// Using inline SVGs to prevent build errors
const startIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZGhtPSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNEQzOUUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSw5IDAgMCAxIDE4LDB6Ij48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzM0RDM5RSI+PC9jaXJjbGU+PC9zdmc+";
const endIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZGhtPSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNFRjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSw5IDAgMCAxIDE4LDB6Ij48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iI0VGN DQ0NCI+PC9jaXJjbGU+PC9zdmc+";

export default function InputLayout({ onSearch, loading, initialSearchParams }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [transportModes, setTransportModes] = useState({
    rail: true,
    bus: true
  });

  // State and options for sorting
  const [sortCriteria, setSortCriteria] = useState('recommended');
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  
  // useEffect to persist search options
  useEffect(() => {
    if (initialSearchParams) {
      setSortCriteria(initialSearchParams.sortCriteria || 'recommended');
      setTransportModes(initialSearchParams.transportModes || { rail: true, bus: true });
    }
  }, []); // Empty dependency array means this runs only once on mount

  const sortOptions = {
    'recommended': 'Recommended',
    'duration-asc': 'Shortest Time',
    'duration-desc': 'Longest Time',
    'transfers-asc': 'Fewest Transfers',
  };

  const fetchSuggestions = async (query, setFn) => {
    // ... (rest of the function is unchanged)
    if (query.length < 3) {
      setFn([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + ", Mumbai"
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await res.json();
      setFn(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const fetchCoordinatesForLocation = async (locationName) => {
    // ... (rest of the function is unchanged)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          locationName + ", Mumbai"
        )}&format=json&addressdetails=1&limit=1`
      );
      const data = await res.json();

      if (data.length === 0) {
        const resGlobal = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            locationName
          )}&format=json&addressdetails=1&limit=1`
        );
        const dataGlobal = await resGlobal.json();
        return dataGlobal.length > 0 ? dataGlobal[0] : null;
      }

      return data[0];
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      return null;
    }
  };

  const reverseGeocode = async (lat, lon) => {
    // ... (rest of the function is unchanged)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      );
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      return null;
    }
  };

  const getCurrentLocation = () => {
    // ... (rest of the function is unchanged)
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const locationData = await reverseGeocode(latitude, longitude);
          if (locationData) {
            setFrom(locationData.display_name);
            setSelectedFrom({
              ...locationData,
              lat: latitude.toString(),
              lon: longitude.toString()
            });
            setFromSuggestions([]);
          } else {
            setFrom("Current Location");
            setSelectedFrom({
              display_name: "Current Location",
              lat: latitude.toString(),
              lon: longitude.toString()
            });
          }
        } catch (err) {
          console.error("Error getting location details:", err);
          setFrom("Current Location");
          setSelectedFrom({
            display_name: "Current Location",
            lat: latitude.toString(),
            lon: longitude.toString()
          });
        }
        
        setGettingLocation(false);
      },
      (error) => {
        setGettingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location access denied by user.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out.");
            break;
          default:
            alert("An unknown error occurred while getting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setSelectedFrom(selectedTo);
    setSelectedTo(selectedFrom);
    setFromSuggestions([]);
    setToSuggestions([]);
  };

  const handleTransportModeChange = (mode) => {
    const newModes = {
      ...transportModes,
      [mode]: !transportModes[mode]
    };
    
    const selectedCount = Object.values(newModes).filter(Boolean).length;
    if (selectedCount === 0) {
      alert("Please select at least one transportation mode.");
      return;
    }
    
    setTransportModes(newModes);
  };
  
  // --- NEW: Handler for the Reset button ---
  const handleReset = () => {
    setSortCriteria('recommended');
    setTransportModes({
      rail: true,
      bus: true,
    });
  };

  const handleSearch = async () => {
    // ... (rest of the function is unchanged)
    if (!from || !to) {
      alert("Please enter both starting and destination locations");
      return;
    }

    const selectedModes = Object.values(transportModes).filter(Boolean).length;
    if (selectedModes === 0) {
      alert("Please select at least one transportation mode");
      return;
    }

    let startLocation = selectedFrom;
    let destinationLocation = selectedTo;

    if (!selectedFrom) {
      startLocation = await fetchCoordinatesForLocation(from);
      if (!startLocation) {
        alert(
          `Invalid starting location: "${from}". Please check the spelling or try a different location.`
        );
        return;
      }
    }

    if (!selectedTo) {
      destinationLocation = await fetchCoordinatesForLocation(to);
      if (!destinationLocation) {
        alert(
          `Invalid destination: "${to}". Please check the spelling or try a different location.`
        );
        return;
      }
    }

    onSearch({
      start: {
        lat: parseFloat(startLocation.lat),
        lon: parseFloat(startLocation.lon),
      },
      destination: {
        lat: parseFloat(destinationLocation.lat),
        lon: parseFloat(destinationLocation.lon),
      },
      transportModes: transportModes,
      sortCriteria: sortCriteria,
    });
  };

  const handleKeyDown = (e, field) => {
    // ... (rest of the function is unchanged)
    if (e.key === 'Enter') {
      if (field === 'from') {
        setFromSuggestions([]);
      } else {
        setToSuggestions([]);
      }
      
      if (from && to) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      if (field === 'from') {
        setFromSuggestions([]);
      } else {
        setToSuggestions([]);
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-6">
      <div className="relative">
        <div className="relative">
          <div className="flex items-center space-x-3">
            <img src={startIcon} alt="Start" className="w-8 h-8" />
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setSelectedFrom(null);
                  fetchSuggestions(e.target.value, setFromSuggestions);
                }}
                onKeyDown={(e) => handleKeyDown(e, 'from')}
                className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                placeholder="Starting location"
              />
              <button
                onClick={getCurrentLocation}
                disabled={gettingLocation}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-3 py-3 rounded-lg transition-all duration-200 flex items-center justify-center min-w-[44px]"
                title="Use current location"
              >
                {gettingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {fromSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-20">
              {fromSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => {
                    setFrom(suggestion.display_name);
                    setSelectedFrom(suggestion);
                    setFromSuggestions([]);
                  }} className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0" >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button onClick={handleSwap} className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-100 rounded-full p-3 z-30 transform transition-all duration-300 hover:rotate-180 hover:bg-green-200 hover:scale-110" >
          <ArrowUpDown className="h-5 w-5 text-green-600" />
        </button>

        <div className="relative mb-6 mt-4">
          <div className="flex items-center space-x-3">
            <img src={endIcon} alt="End" className="w-8 h-8" />
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setSelectedTo(null);
                fetchSuggestions(e.target.value, setToSuggestions);
              }}
              onKeyDown={(e) => handleKeyDown(e, 'to')}
              className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="Destination"
            />
          </div>

          {toSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-20">
              {toSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => {
                    setTo(suggestion.display_name);
                    setSelectedTo(suggestion);
                    setToSuggestions([]);
                  }} className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* Left side: Transport Mode Buttons */}
        <div className="flex items-center gap-2">
            <button 
                onClick={() => handleTransportModeChange('bus')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full transition-colors ${
                    transportModes.bus 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <Bus className="h-4 w-4" />
                <span>Bus</span>
            </button>
            <button 
                onClick={() => handleTransportModeChange('rail')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full transition-colors ${
                    transportModes.rail 
                    ? 'bg-green-600 text-white border-green-600' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <Train className="h-4 w-4" />
                <span>Train</span>
            </button>
        </div>

        {/* Right side: Sort/Reset Buttons */}
        <div className="flex items-center gap-2">
            {/* --- MODIFIED: onClick now calls handleReset --- */}
            <button onClick={handleReset} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Reset
            </button>
            <div className="relative">
                <button onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                  <span>
                    Sort by: <span className="font-semibold">{sortOptions[sortCriteria]}</span>
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isSortDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1">
                            {Object.entries(sortOptions).map(([key, value]) => (
                                <button key={key} onClick={() => {
                                    setSortCriteria(key);
                                    setIsSortDropdownOpen(false);
                                  }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between">
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


      <button onClick={handleSearch} disabled={loading} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>SEARCHING...</span>
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5" />
            <span>FIND JOURNEYS</span>
          </>
        )}
      </button>
    </div>
  );
}

