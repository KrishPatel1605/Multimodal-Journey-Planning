import axios from "axios";

export const getOTPRoute = async (start, destination, transportModes = {}) => {
  const { lat: fromLat, lon: fromLon } = start;
  const { lat: toLat, lon: toLon } = destination;

  const modeMapping = {
    rail: "RAIL",
    bus: "BUS",
    walk: "WALK",
    tram: "TRAM",
    subway: "SUBWAY",
    ferry: "FERRY"
  };

  let selectedModes = Object.entries(transportModes)
    .filter(([_, value]) => value === true)
    .map(([key]) => modeMapping[key])
    .filter(Boolean);

  if (selectedModes.length === 0) {
    selectedModes = ["WALK"];
  }

  if (!selectedModes.includes("WALK")) {
    selectedModes.push("WALK");
  }

  const url = `${process.env.OTP_BASE_URL}/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=${selectedModes.join(",")}`;

  const response = await axios.get(url);
  return response.data;
};
