import { useState, useEffect } from "react";
import { ArrowUpDown, Navigation, Loader2, MapPin, Train, Bus, Check } from "lucide-react";

const startIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2hmPSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNEQzOUUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSw5IDAgMCAxIDE4LDB6Ij48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iIzM0RDM5RSI+PC9jaXJjbGU+PC9zdmc+";
const endIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2hmPSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNFRjQ0NDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjEgMTBjMCA3LTkgMTMtOSAxM3MtOS02LTktMTNhOSw5IDAgMCAxIDE4LDB6Ij48L3BhdGg+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMCIgcj0iMyIgZmlsbD0iI0VGNDQ0NCI+PC9jaXJjbGU+PC9zdmc+";

export default function InputLayout({ onSearch, loading }) {
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

  const fetchSuggestions = async (query, setFn) => {
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

  const handleSearch = async () => {
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
    });
  };

  const handleKeyDown = (e, field) => {
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
      
      <div className="flex items-center justify-center gap-4 mb-6">
        <button 
          onClick={() => handleTransportModeChange('bus')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full transition-colors relative ${
            transportModes.bus 
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <Bus className="h-4 w-4" />
          <span>Bus</span>
          {transportModes.bus && (
            <Check className="h-4 w-4 ml-1" />
          )}
        </button>
        <button 
          onClick={() => handleTransportModeChange('rail')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border rounded-full transition-colors relative ${
            transportModes.rail 
            ? 'bg-green-600 text-white border-green-600' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
        >
          <Train className="h-4 w-4" />
          <span>Train</span>
          {transportModes.rail && (
            <Check className="h-4 w-4 ml-1" />
          )}
        </button>
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