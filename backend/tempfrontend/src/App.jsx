import React from 'react';
import TripPlanner from './components/TripPlanner/TripPlanner';
import { tripData } from './data/tripData';

function App() {
  return (
    <div className="App">
      <TripPlanner data={tripData} />
    </div>
  );
}

export default App;