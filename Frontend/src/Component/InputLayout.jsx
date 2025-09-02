import { useState } from "react";
import { ArrowUpDown } from "lucide-react"; // swap icon
import start from "../assets/start.png";
import end from "../assets/end2.png";

export default function TrainSearch() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md ">

      <div className="relative">
        {/* From */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-500">
            <img src={start} className="w-8 h-8" alt="start" />
          </span>
          <input
            type="text"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-3 rounded-t-lg focus:outline-none focus:border-green-500"
            placeholder="Starting location"
          />
        </div>

        {/* Swap Button → positioned between inputs */}
        <button
          onClick={handleSwap}
          className="absolute right-2 top-1/2 -translate-y-1/2  bg-green-100 rounded-full p-3 shadow-2xl transform transition-transform duration-500 hover:rotate-[180deg] hover:bg-green-200 "
        >
          <ArrowUpDown className="h-5 w-5 text-green-600 " />
        </button>

        {/* To */}
        <div className="flex items-center space-x-3 ">
          <span className="text-gray-500">
            <img src={end} className="w-8 h-8" alt="end" />
          </span>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-3 rounded-b-lg focus:outline-none focus:border-green-500 rounded-top-lg"
            placeholder="Destination"
          />
        </div>
      </div>

      {/* Search Button */}
      <button className="w-full mt-10 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition">
        SEARCH PATHS
      </button>
    </div>
  );
}
