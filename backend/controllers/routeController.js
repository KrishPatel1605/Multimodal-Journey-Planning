import { getOTPRoute } from "../services/otpService.js";
import { calculateFare } from "../services/fareService.js";
import { calculateTrainFare } from "../services/trainFareService.js";
import { calculateBusFare } from "../services/busFareService.js";
import { identifyTrainType } from "../services/trainTypeService.js";

export const getRoutes = async (req, res) => {
  try {
    const { start, destination, transportModes = {} } = req.body;

    if (!start || !destination) {
      return res
        .status(400)
        .json({ error: "Start and destination are required" });
    }

    const otpResponse = await getOTPRoute(start, destination, transportModes);

    const processedRoutes = otpResponse.plan.itineraries.map((itinerary) => {
      itinerary.legs = itinerary.legs.map((leg) => {
        if (leg.mode === "WALK" && leg.distance > 750) {
          const uber = calculateFare(
            { lat: leg.from.lat, lon: leg.from.lon },
            { lat: leg.to.lat, lon: leg.to.lon }
          );

          leg.mode = "UBER";
          leg.fares = {
            auto: uber.auto,
            car: uber.car,
            moto: uber.moto,
          };
          leg.distance = uber.distance;
          leg.duration = uber.duration;
        }

        if (leg.mode === "RAIL") {
          const trainFare = calculateTrainFare(leg.distance / 1000);
          leg.fares = {
            secondClass: trainFare.secondClass,
            firstClass: trainFare.firstClass,
          };

          leg.trainType = identifyTrainType(leg);
        }

        if (leg.mode === "BUS") {
          const busFare = calculateBusFare(leg.distance / 1000);
          leg.fares = {
            nonAC: busFare.nonAC,
            ac: busFare.ac,
          };
        }

        return leg;
      });

      itinerary.duration = itinerary.legs.reduce(
        (total, leg) => total + leg.duration,
        0
      );

      return itinerary;
    });

    res.json({ ...otpResponse, plan: { itineraries: processedRoutes } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
