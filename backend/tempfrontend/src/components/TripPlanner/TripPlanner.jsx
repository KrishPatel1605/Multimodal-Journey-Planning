import React, { useState } from 'react';
import './TripPlanner.css'; // We'll create this CSS file

const TripPlanner = ({ data }) => {
    const [selectedItinerary, setSelectedItinerary] = useState(0);

    // Check if data is available
    if (!data || !data.plan || !data.plan.itineraries) {
        return <div className="loading">Loading trip data...</div>;
    }

    // Format time from milliseconds to readable format
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Format duration from seconds to hours and minutes
    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    // Format distance from meters to kilometers
    const formatDistance = (meters) => {
        return (meters / 1000).toFixed(1) + ' km';
    };

    // Render walking directions steps
    const renderSteps = (steps) => {
        return steps.map((step, index) => (
            <div key={index} className="step">
                <div className="step-direction">
                    {step.relativeDirection.toLowerCase().replace(/_/g, ' ')} on
                </div>
                <div className="step-street">{step.streetName}</div>
                {step.alerts && step.alerts.length > 0 && (
                    <div className="step-alert">⚠️ {step.alerts[0].alertHeaderText}</div>
                )}
            </div>
        ));
    };

    // Render a transportation leg
    const renderLeg = (leg, index) => {
        return (
            <div key={index} className={`leg ${leg.mode.toLowerCase()}`}>
                <div className="leg-header">
                    <div className="leg-mode">
                        {leg.mode === 'WALK' ? '🚶 Walk' : `🚌 Bus: ${leg.routeShortName || 'Unknown'}`}
                    </div>
                    <div className="leg-time">
                        {formatTime(leg.startTime)} - {formatTime(leg.endTime)}
                        <span className="leg-duration"> ({formatDuration(leg.duration / 1000)})</span>
                    </div>
                </div>

                <div className="leg-route">
                    <div className="leg-from">
                        <strong>From:</strong> {leg.from.name}
                    </div>
                    <div className="leg-to">
                        <strong>To:</strong> {leg.to.name}
                    </div>
                </div>

                {leg.mode === 'WALK' && leg.steps && (
                    <div className="walking-steps">
                        {renderSteps(leg.steps)}
                    </div>
                )}

                {leg.mode === 'BUS' && (
                    <div className="bus-details">
                        <div className="bus-route">{leg.headsign || 'Bus'}</div>
                        <div className="bus-agency">Operated by: {leg.agencyName || 'Unknown'}</div>
                    </div>
                )}
            </div>
        );
    };

    const itineraries = data.plan.itineraries;

    return (
        <div className="trip-planner">
            <header className="trip-header">
                <h1>Trip Planner</h1>
                <div className="route-summary">
                    <div className="from-to">
                        <span className="location">{data.plan.from.name}</span>
                        <span className="arrow">→</span>
                        <span className="location">{data.plan.to.name}</span>
                    </div>
                </div>
            </header>

            <div className="itinerary-selector">
                <h2>Available Itineraries</h2>
                <div className="itinerary-options">
                    {itineraries.map((itinerary, index) => (
                        <div
                            key={index}
                            className={`itinerary-option ${selectedItinerary === index ? 'selected' : ''}`}
                            onClick={() => setSelectedItinerary(index)}
                        >
                            <div className="option-time">{formatTime(itinerary.startTime)}</div>
                            <div className="option-duration">{formatDuration(itinerary.duration)}</div>
                            <div className="option-transfers">{itinerary.transfers} transfer(s)</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="itinerary-details">
                <h2>Route Details</h2>
                <div className="itinerary-summary">
                    <div className="summary-item">
                        <span className="label">Departure:</span>
                        <span className="value">{formatTime(itineraries[selectedItinerary].startTime)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Arrival:</span>
                        <span className="value">{formatTime(itineraries[selectedItinerary].endTime)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Total time:</span>
                        <span className="value">{formatDuration(itineraries[selectedItinerary].duration)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Walking:</span>
                        <span className="value">{formatDistance(itineraries[selectedItinerary].walkDistance)}</span>
                    </div>
                    <div className="summary-item">
                        <span className="label">Transfers:</span>
                        <span className="value">{itineraries[selectedItinerary].transfers}</span>
                    </div>
                </div>

                <div className="legs-container">
                    {itineraries[selectedItinerary].legs.map((leg, index) => renderLeg(leg, index))}
                </div>
            </div>
        </div>
    );
};

export default TripPlanner;