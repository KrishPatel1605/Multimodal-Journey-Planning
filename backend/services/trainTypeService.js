export const identifyTrainType = (leg) => {
  if (!leg || leg.mode !== "RAIL" || !leg.from || !leg.to) {
    return "UNKNOWN";
  }

  const { from, to, distance, duration } = leg;

  const distanceKm = distance / 1000;
  const durationMin = duration / 60;
  const avgSpeed = distanceKm / (durationMin / 60);

  const stopsCrossed = (to.stopSequence || to.stopIndex) - (from.stopSequence || from.stopIndex);

  if (stopsCrossed <= 1 && avgSpeed >= 35) {
    return "Fast";
  }

  return "Slow";
};
