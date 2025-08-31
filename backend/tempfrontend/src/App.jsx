import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { planTrip } from "./api"

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function App() {
  const [stations, setStations] = useState([])
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [fromCoords, setFromCoords] = useState(null)
  const [toCoords, setToCoords] = useState(null)
  const [itinerary, setItinerary] = useState(null)
  const [backendUrl, setBackendUrl] = useState("http://localhost:8080")

  useEffect(() => {
    fetch("/stations.json")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch((e) => console.error("Failed to load stations.json", e))
  }, [])

  const handlePlan = async () => {
    if (!fromCoords || !toCoords) {
      alert("Select both origin and destination.")
      return
    }
    try {
      const res = await planTrip(
        {
          fromLat: fromCoords.lat,
          fromLon: fromCoords.lon,
          toLat: toCoords.lat,
          toLon: toCoords.lon,
        },
        backendUrl
      )
      setItinerary(res.plan || res)
    } catch (e) {
      console.error(e)
      alert("Error planning trip — check console & OTP server.")
    }
  }

  return (
    <div className="app" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <header style={{ background: "#2563eb", color: "white", padding: "10px" }}>
        <h1>OTP Frontend — Vite + React</h1>
        <label>
          OTP Base URL:
          <input
            style={{ marginLeft: "10px", padding: "4px" }}
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
          />
        </label>
      </header>

      <main style={{ flex: 1, display: "flex" }}>
        {/* Sidebar */}
        <aside style={{ width: "300px", padding: "10px", borderRight: "1px solid #ddd" }}>
          <h2>Stations</h2>
          <label>
            From
            <select
              value={from}
              onChange={(e) => {
                const id = e.target.value
                setFrom(id)
                const s = stations.find((x) => x.label === id)
                if (s) {
                  const [lat, lon] = s.value.split(",").map(Number)
                  setFromCoords({ lat, lon })
                }
              }}
            >
              <option value="">-- select origin --</option>
              {stations.map((s, idx) => (
                <option key={idx} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <br />

          <label>
            To
            <select
              value={to}
              onChange={(e) => {
                const id = e.target.value
                setTo(id)
                const s = stations.find((x) => x.label === id)
                if (s) {
                  const [lat, lon] = s.value.split(",").map(Number)
                  setToCoords({ lat, lon })
                }
              }}
            >
              <option value="">-- select destination --</option>
              {stations.map((s, idx) => (
                <option key={idx} value={s.label}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <br />
          <button onClick={handlePlan} style={{ marginTop: "10px", padding: "6px 12px", background: "#2563eb", color: "white", border: "none", borderRadius: "4px" }}>
            Plan Trip
          </button>

          {/* Itinerary */}
          {itinerary && itinerary.itineraries && (
            <div style={{ marginTop: "20px" }}>
              <h3>Itinerary</h3>
              {itinerary.itineraries[0].legs.map((leg, idx) => (
                <div key={idx} style={{ border: "1px solid #ddd", padding: "8px", marginBottom: "6px", borderRadius: "6px", background: "#f9f9f9" }}>
                  <strong>{leg.mode}</strong> — {leg.from.name} → {leg.to.name}
                  <br />
                  <small>
                    {new Date(leg.startTime).toLocaleTimeString()} -{" "}
                    {new Date(leg.endTime).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Map */}
        <section style={{ flex: 1 }}>
          <MapContainer center={[19.076, 72.8777]} zoom={12} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {fromCoords && (
              <Marker position={[fromCoords.lat, fromCoords.lon]}>
                <Popup>Origin</Popup>
              </Marker>
            )}
            {toCoords && (
              <Marker position={[toCoords.lat, toCoords.lon]}>
                <Popup>Destination</Popup>
              </Marker>
            )}
            {itinerary &&
              itinerary.itineraries &&
              itinerary.itineraries[0].legs.map((leg, idx) => {
                const latlngs = leg.legGeometry?.points
                  ? decodePolyline(leg.legGeometry.points)
                  : []
                return <Polyline key={idx} positions={latlngs} color="blue" />
              })}
          </MapContainer>
        </section>
      </main>
    </div>
  )
}

// Polyline decoder
function decodePolyline(encoded) {
  if (!encoded) return []
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = []
  while (index < encoded.length) {
    let result = 1,
      shift = 0,
      b
    do {
      b = encoded.charCodeAt(index++) - 63 - 1
      result += b << shift
      shift += 5
    } while (b >= 0x1f)
    lat += result & 1 ? ~(result >> 1) : result >> 1

    result = 1
    shift = 0
    do {
      b = encoded.charCodeAt(index++) - 63 - 1
      result += b << shift
      shift += 5
    } while (b >= 0x1f)
    lng += result & 1 ? ~(result >> 1) : result >> 1

    coordinates.push([lat * 1e-5, lng * 1e-5])
  }
  return coordinates
}
