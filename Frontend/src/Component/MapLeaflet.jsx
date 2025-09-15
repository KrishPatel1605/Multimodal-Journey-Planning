// MapLeaflet.jsx
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";

// optional helper to programmatically fit bounds
function FitBounds({ bounds }) {
  const map = useMap();
  if (bounds && bounds.length) {
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  return null;
}

const defaultCenter = [19.07599, 72.877655]; // Mumbai example
const sampleMarkers = [
  { id: 1, pos: [19.07599, 72.877655], title: "A", info: "Start point" },
  { id: 2, pos: [19.080, 72.88], title: "B", info: "End point" },
];

export default function MapLeaflet({ height = "500px", zoom = 13 }) {
  const [markers] = useState(sampleMarkers);

  // compute bounds from markers
  const bounds = markers.map((m) => m.pos);

  return (
    <div style={{ width: "100%", height }}>
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

        {/* example polyline connecting markers */}
        <Polyline positions={markers.map((m) => m.pos)} />

        {/* fit map to markers on first render */}
        <FitBounds bounds={bounds} />
      </MapContainer>
    </div>
  );
}
