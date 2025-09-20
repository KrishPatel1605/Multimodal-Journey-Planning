import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import polyline from "polyline";

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

const defaultCenter = [19.07599, 72.877655];

const modeStyles = {
  WALK: { color: "#6b7280", emoji: "🚶" },
  BUS: { color: "#f97316", emoji: "🚌" },
  RAIL: { color: "#2563eb", emoji: "🚆" },
  SUBWAY: { color: "#7c3aed", emoji: "🚇" },
  TRAM: { color: "#059669", emoji: "🚋" },
  UBER: { color: "#000000", emoji: "🚖" },
  CAR: { color: "#dc2626", emoji: "🚗" },
  DEFAULT: { color: "#0891b2", emoji: "📍" },
};

const PlaceholderMap = ({ routes, height, selectedRoute, showAllRoutes }) => {
  const displayText = selectedRoute 
    ? "Showing selected route details"
    : routes && routes.length > 0 
      ? `Showing ${routes.length} route${routes.length !== 1 ? 's' : ''} on map`
      : "Select locations to see routes on map";

  return (
    <div 
      className="w-full bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border border-gray-200 flex items-center justify-center relative overflow-hidden"
      style={{ height }}
    >
      <div className="absolute inset-0 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="text-center z-10">
        <div className="text-6xl mb-4">🗺️</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
        <p className="text-gray-600 text-sm max-w-md">
          {displayText}
        </p>
        {selectedRoute && (
          <div className="mt-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg inline-block">
            <span className="text-sm font-medium">📍 Detailed Route View</span>
          </div>
        )}
      </div>
      
      {routes && routes.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Start</span>
            <div className="w-3 h-3 bg-red-500 rounded-full ml-4"></div>
            <span>End</span>
          </div>
          {selectedRoute && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="text-xs text-blue-600 font-medium">Selected Route</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function MapLeaflet({ 
  height = "500px", 
  zoom = 13, 
  routeData = null,
  routes = [],
  selectedRoute = null,
  showAllRoutes = true
}) {
  const [legs, setLegs] = useState([]);
  const [isLeafletAvailable, setIsLeafletAvailable] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLeafletAvailable(false);
      return;
    }

    let targetRoute = null;
    
    if (selectedRoute) {
      targetRoute = selectedRoute;
    } else if (routeData?.plan?.itineraries?.length) {
      targetRoute = routeData.plan.itineraries[0];
    } else if (showAllRoutes && routes && routes.length > 0 && routes[0].legs) {
      targetRoute = routes[0];
    }

    if (targetRoute && targetRoute.legs) {
      setLegs(targetRoute.legs || []);
    } else {
      setLegs([]);
    }
  }, [routeData, routes, selectedRoute, showAllRoutes]);

  if (!isLeafletAvailable) {
    return (
      <PlaceholderMap 
        routes={routes} 
        height={height} 
        selectedRoute={selectedRoute}
        showAllRoutes={showAllRoutes}
      />
    );
  }

  try {
    const markers = [];
    const polylines = [];

    legs.forEach((leg, i) => {
      const style = modeStyles[leg.mode] || modeStyles.DEFAULT;

      const enhancedStyle = selectedRoute ? {
        ...style,
        weight: 6,
        opacity: 0.9
      } : {
        ...style,
        weight: 4,
        opacity: 0.8
      };

      if (leg.from && leg.from.lat && leg.from.lon) {
        markers.push({
          id: `from-${i}`,
          pos: [leg.from.lat, leg.from.lon],
          title: `${style.emoji} ${leg.from.name}`,
          info: `${leg.mode} start`,
          isStart: i === 0,
        });
      }
      
      if (leg.to && leg.to.lat && leg.to.lon) {
        markers.push({
          id: `to-${i}`,
          pos: [leg.to.lat, leg.to.lon],
          title: `${style.emoji} ${leg.to.name}`,
          info: `${leg.mode} end`,
          isEnd: i === legs.length - 1,
        });
      }

      if (leg.legGeometry?.points) {
        try {
          const coords = polyline
            .decode(leg.legGeometry.points)
            .map(([lat, lon]) => [lat, lon]);
          polylines.push({ 
            coords, 
            color: enhancedStyle.color, 
            weight: enhancedStyle.weight, 
            opacity: enhancedStyle.opacity,
            mode: leg.mode 
          });
        } catch (error) {
          console.warn('Error decoding polyline:', error);
        }
      }
    });

    const bounds = markers.length > 0 ? markers.map((m) => m.pos) : null;

    return (
      <div style={{ width: "100%", height }} className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative">
        {selectedRoute && (
          <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-md p-3 max-w-xs">
            <div className="text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-semibold text-gray-800">Selected Route</span>
              </div>
              <div className="text-xs text-gray-600">
                <p>Duration: {Math.round(selectedRoute.duration / 60)} min</p>
                <p>Modes: {selectedRoute.legs?.map(leg => leg.mode).join(' → ')}</p>
              </div>
            </div>
          </div>
        )}

        <MapContainer
          center={bounds && bounds.length > 0 ? bounds[0] : defaultCenter}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map((m) => (
            <Marker key={m.id} position={m.pos}>
              <Popup>
                <div className="text-center">
                  <strong className="text-gray-800">{m.title}</strong>
                  <div className="text-sm text-gray-600 mt-1">{m.info}</div>
                  {m.isStart && <div className="text-xs text-green-600 mt-1">🚩 Journey Start</div>}
                  {m.isEnd && <div className="text-xs text-red-600 mt-1">🏁 Journey End</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {polylines.map((line, idx) => (
            <Polyline 
              key={idx} 
              positions={line.coords} 
              color={line.color}
              weight={line.weight}
              opacity={line.opacity}
            />
          ))}

          {bounds && <FitBounds bounds={bounds} />}
        </MapContainer>
      </div>
    );
  } catch (error) {
    console.error('Error rendering Leaflet map:', error);
    return (
      <PlaceholderMap 
        routes={routes} 
        height={height} 
        selectedRoute={selectedRoute}
        showAllRoutes={showAllRoutes}
      />
    );
  }
}