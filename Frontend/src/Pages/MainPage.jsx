import React from "react";
import uberData from "../assets/sampleuber.json";
import trainData from "../assets/sampletrain.json";
import busData from "../assets/samplebus.json";
import InputLayout from "../Component/InputLayout";
import MapLeaflet from "../Component/MapLeaflet";
import JourneyList from "../Component/JourneyList";

const MainPage = () => {
  // merge all routes into one array
  const itineraries = [
    ...(uberData.plan?.itineraries || []),
    ...(trainData.plan?.itineraries || []),
    ...(busData.plan?.itineraries || [])
  ];

  return (
    <div className="flex h-screen bg-white p-8 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 h-full w-1/4">
        {/* Top Card */}
        <div className="rounded-2xl flex items-center">
          <InputLayout />
        </div>
        {/* Bottom Card */}
        <div className="rounded-2xl flex-1 flex overflow-y-auto">
          <JourneyList itineraries={itineraries} />
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 ml-6 bg-white rounded-2xl flex items-stretch justify-center h-full">
        <MapLeaflet zoom={12} />
      </div>
    </div>
  );
};

export default MainPage;