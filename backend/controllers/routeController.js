import { getOTPRoute } from "../services/otpService.js";
import { calculateFare } from "../services/fareService.js";

export const getRoutes = async (req, res) => {
  try {
    const { start, destination } = req.body;

    if (!start || !destination) {
      return res.status(400).json({ error: "Start and destination are required" });
    }

    const otpResponse = await getOTPRoute(start, destination);

    const processedRoutes = otpResponse.plan.itineraries.map((itinerary) => {
      itinerary.legs = itinerary.legs.map((leg) => {
        if (leg.mode === "WALK" && leg.distance > 750) {
          const uber = calculateFare(
            { lat: leg.from.lat, lon: leg.from.lon },
            { lat: leg.to.lat, lon: leg.to.lon }
          );

          // Replace walk with Uber leg
          leg.mode = "UBER";
          leg.fares = {
            auto: uber.auto,
            car: uber.car,
            moto: uber.moto,
          };
          leg.distance = uber.distance;
          leg.duration = uber.duration; // ✅ Uber travel time
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
