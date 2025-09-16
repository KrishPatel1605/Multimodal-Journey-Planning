import axios from "axios";

export const getOTPRoute = async (start, destination) => {
  const { lat: fromLat, lon: fromLon } = start;
  const { lat: toLat, lon: toLon } = destination;

  const url = `${process.env.OTP_BASE_URL}/plan?fromPlace=${fromLat},${fromLon}&toPlace=${toLat},${toLon}&mode=TRANSIT,WALK`;

  const response = await axios.get(url);
  return response.data;
};
