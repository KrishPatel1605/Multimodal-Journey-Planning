import { useState } from "react";
import { ArrowUpDown, Navigation, Loader2 } from "lucide-react";

// Mock icons for start/end points since we don't have the image assets
const StartIcon = () => (
  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
    <div className="w-3 h-3 bg-white rounded-full"></div>
  </div>
);

const EndIcon = () => (
  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
    <div className="w-3 h-3 bg-white rounded-full"></div>
  </div>
);

export default function InputLayout({ onSearch, loading }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

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

  const handleSearch = () => {
    if (!from || !to) {
      alert("Please enter both starting and destination locations");
      return;
    }

    if (!selectedFrom || !selectedTo) {
      alert("Please select valid locations from the suggestions");
      return;
    }

    // Call the parent's onSearch function with the required format
    onSearch({
      start: { lat: parseFloat(selectedFrom.lat), lon: parseFloat(selectedFrom.lon) },
      destination: { lat: parseFloat(selectedTo.lat), lon: parseFloat(selectedTo.lon) }
    });
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="relative">
        {/* FROM Input */}
        <div className="relative mb-4">
          <div className="flex items-center space-x-3">
            <StartIcon />
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setSelectedFrom(null);
                fetchSuggestions(e.target.value, setFromSuggestions);
              }}
              className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="Starting location"
            />
          </div>

          {/* FROM Suggestions Dropdown */}
          {fromSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-20">
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFrom(suggestion.display_name);
                    setSelectedFrom(suggestion);
                    setFromSuggestions([]);
                  }}
                  className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwap}
            className="bg-green-100 rounded-full p-3 shadow-md transform transition-all duration-300 hover:rotate-180 hover:bg-green-200 hover:scale-110"
          >
            <ArrowUpDown className="h-5 w-5 text-green-600" />
          </button>
        </div>

        {/* TO Input */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-3">
            <EndIcon />
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setSelectedTo(null);
                fetchSuggestions(e.target.value, setToSuggestions);
              }}
              className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              placeholder="Destination"
            />
          </div>

          {/* TO Suggestions Dropdown */}
          {toSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-200 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-20">
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setTo(suggestion.display_name);
                    setSelectedTo(suggestion);
                    setToSuggestions([]);
                  }}
                  className="px-4 py-3 text-sm hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>SEARCHING...</span>
          </>
        ) : (
          <>
            <Navigation className="h-5 w-5" />
            <span>FIND ROUTES</span>
          </>
        )}
      </button>
    </div>
  );
}