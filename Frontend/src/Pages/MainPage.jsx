import React from "react";
import InputLayout from "../Component/InputLayout";
import AllRoute from "../Component/AllRoute";
import MapLeaflet from "../Component/MapLeaflet";
import JourneyList from "../Component/JourneyList";

const MainPage = () => {
  return (
    <div className="flex h-screen bg-white p-8 font-sans">
      {/* Sidebar */}
      <div className="flex flex-col gap-6 h-full w-1/4">
        {/* Top Card */}
        <div className="rounded-2xl flex items-center">
          <InputLayout />
        </div>
        {/* Bottom Card */}
        <div className="rounded-2xl flex-1 flex items-center">
          <JourneyList />
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
