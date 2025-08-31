import React from "react";

export default function StationSelector({ label, stations, selected, onChange }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
        {label}
      </label>
      <select
        value={selected ? selected.value : ""}
        onChange={(e) => {
          const station = stations.find((s) => s.value === e.target.value);
          onChange(station || null);
        }}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">-- Select --</option>
        {stations.map((station, idx) => (
          <option key={idx} value={station.value}>
            {station.label}
          </option>
        ))}
      </select>
    </div>
  );
}
