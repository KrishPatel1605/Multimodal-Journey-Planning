import { useState } from "react";
import { ArrowUpDown } from "lucide-react"; // swap icon
import start from "../assets/start.png";
import end from "../assets/end2.png";

export default function TrainSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const [selectedFrom, setSelectedFrom] = useState(null); // ✅ New state
  const [selectedTo, setSelectedTo] = useState(null);     // ✅ New state

  const fetchSuggestions = async (query, setFn) => {
    if (query.length < 3) {
      setFn([]);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
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
    setSelectedFrom(selectedTo); // ✅ swap coordinates
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

    console.log("Searching paths from:", selectedFrom.display_name, "to:", selectedTo.display_name);
    console.log("From coords:", selectedFrom.lat, selectedFrom.lon);
    console.log("To coords:", selectedTo.lat, selectedTo.lon);

    // 👉 Here you can call a routing API using selectedFrom.lat/lon and selectedTo.lat/lon
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md">
      <div className="relative">

        {/* FROM Input */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">
              <img src={start} className="w-8 h-8" alt="start" />
            </span>
            <input
              type="text"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setSelectedFrom(null); // ✅ clear previous selection
                fetchSuggestions(e.target.value, setFromSuggestions);
              }}
              className="flex-1 border border-gray-300 px-3 py-3 rounded-t-lg focus:outline-none focus:border-green-500"
              placeholder="Starting location"
            />
          </div>

          {/* FROM Suggestions Dropdown */}
          {fromSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-300 rounded-b-md max-h-40 overflow-y-auto shadow z-10">
              {fromSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setFrom(suggestion.display_name);
                    setSelectedFrom(suggestion); // ✅ save full suggestion
                    setFromSuggestions([]);
                  }}
                  className="px-3 py-2 text-sm hover:bg-green-100 cursor-pointer"
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 rounded-full p-3 shadow-2xl transform transition-transform duration-500 hover:rotate-[180deg] hover:bg-green-200 z-20"
        >
          <ArrowUpDown className="h-5 w-5 text-green-600" />
        </button>

        {/* TO Input */}
        <div className="relative">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">
              <img src={end} className="w-8 h-8" alt="end" />
            </span>
            <input
              type="text"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setSelectedTo(null); // ✅ clear previous selection
                fetchSuggestions(e.target.value, setToSuggestions);
              }}
              className="flex-1 border border-gray-300 px-3 py-3 rounded-b-lg focus:outline-none focus:border-green-500"
              placeholder="Destination"
            />
          </div>

          {/* TO Suggestions Dropdown */}
          {toSuggestions.length > 0 && (
            <ul className="absolute left-11 right-0 bg-white border border-gray-300 rounded-b-md max-h-40 overflow-y-auto shadow z-10">
              {toSuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setTo(suggestion.display_name);
                    setSelectedTo(suggestion); // ✅ save full suggestion
                    setToSuggestions([]);
                  }}
                  className="px-3 py-2 text-sm hover:bg-green-100 cursor-pointer"
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
        className="w-full mt-10 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
      >
        SEARCH PATHS
      </button>
    </div>
  );
}
