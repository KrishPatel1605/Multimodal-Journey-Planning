import axios from 'axios'
import { OTP_BASE_URL } from './config'

// Fetch stations
export const fetchStations = async (stationsJsonUrl) => {
  if (stationsJsonUrl) {
    const res = await axios.get(stationsJsonUrl)
    return res.data
  }
  const res = await axios.get(`${OTP_BASE_URL}/routers/default/index/stations`)
  return res.data
}

// Trip planning (OTP REST API)
export const planTrip = async ({fromLat, fromLon, toLat, toLon, date, time}) => {
  const url = `${OTP_BASE_URL}/otp/routers/default/plan`
  const params = {
    fromPlace: `${fromLat},${fromLon}`,
    toPlace: `${toLat},${toLon}`,
    mode: 'TRANSIT,WALK',
    date: date || undefined,
    time: time || undefined,
    maxWalkDistance: 1000
  }
  const res = await axios.get(url, { params })
  return res.data
}
