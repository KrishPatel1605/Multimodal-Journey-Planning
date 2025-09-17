// MapLeaflet.jsx
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
import sampleData from "../assets/samplebus.json"; // adjust path if needed

// optional helper to programmatically fit bounds
function FitBounds({ bounds }) {
  const map = useMap();
  if (bounds && bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  return null;
}

const defaultCenter = [19.07599, 72.877655]; // fallback center

export default function MapLeaflet({ height = "100vh", zoom = 13 }) {
  const [legs, setLegs] = useState([]);

  useEffect(() => {
    // extract route legs from OTP JSON
    if (sampleData?.plan?.itineraries?.length) {
      const itinerary = sampleData.plan.itineraries[0]; // pick first itinerary
      setLegs(itinerary.legs || []);
    }
  }, []);

  // markers: from + to of each leg
  const markers = [];
  const polylines = [];

  legs.forEach((leg, i) => {
    markers.push({
      id: `from-${i}`,
      pos: [leg.from.lat, leg.from.lon],
      title: leg.from.name,
      info: leg.mode + " start",
    });
    markers.push({
      id: `to-${i}`,
      pos: [leg.to.lat, leg.to.lon],
      title: leg.to.name,
      info: leg.mode + " end",
    });

    if (leg.legGeometry?.points) {
      const coords = polyline.decode(leg.legGeometry.points).map(([lat, lon]) => [lat, lon]);
      polylines.push(coords);
    }
  });

  // bounds for fit
  const bounds = markers.map((m) => m.pos);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer center={defaultCenter} zoom={zoom} style={{ height: "100%", borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((m) => (
          <Marker key={m.id} position={m.pos}>
            <Popup>
              <strong>{m.title}</strong>
              <div>{m.info}</div>
            </Popup>
          </Marker>
        ))}

        {polylines.map((line, idx) => (
          <Polyline key={idx} positions={line} color="blue" />
        ))}

        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
}
