import { getOTPRoute } from "../services/otpService.js";
import { calculateFare } from "../services/fareService.js";

export const getRoutes = async (req, res) => {
  try {
    const { start, destination } = req.body;

    if (!start || !destination) {
      return res.status(400).json({ error: "Start and destination are required" });
    }

    // Fetch routes from OpenTripPlanner
    const otpResponse = await getOTPRoute(start, destination);

    // Process routes → replace long walk with Uber + add fare
    const processedRoutes = otpResponse.plan.itineraries.map((itinerary) => {
      itinerary.legs = itinerary.legs.map((leg) => {
        if (leg.mode === "WALK" && leg.distance > 750) {
          // Replace with Uber
          leg.mode = "UBER";
          leg.fares = calculateFare(
            { lat: leg.from.lat, lon: leg.from.lon },
            { lat: leg.to.lat, lon: leg.to.lon }
          );
        }
        return leg;
      });
      return itinerary;
    });

    res.json({ ...otpResponse, plan: { itineraries: processedRoutes } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
