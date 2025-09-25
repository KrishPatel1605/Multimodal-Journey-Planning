/**
 * Detect if a Mumbai local train is slow or fast
 * @param {Object} leg - OTP response leg object for RAIL
 * @returns {string} "SLOW" | "FAST" | "UNKNOWN"
 */
export const identifyTrainType = (leg) => {
  if (!leg || leg.mode !== "RAIL" || !leg.from || !leg.to) {
    return "UNKNOWN";
  }

  const { from, to, distance, duration } = leg;

  // Convert to readable units
  const distanceKm = distance / 1000; // meters → km
  const durationMin = duration / 60;  // seconds → minutes
  const avgSpeed = distanceKm / (durationMin / 60); // km/h

  // Rule 1: Stop sequence difference
  const stopsCrossed = (to.stopSequence || to.stopIndex) - (from.stopSequence || from.stopIndex);

  // Heuristic rules (tuned for Mumbai locals):
  // - SLOW locals stop at almost every station, so short gaps & lower speeds
  // - FAST locals skip many stops, so fewer stops but higher speed

  if (stopsCrossed <= 1 && avgSpeed >= 35) {
    return "Fast"; // Skipped intermediate stations
  }

  // If ambiguous, fallback
  return "Slow";
};
