// Fake distance/time calculator (Haversine + avg speed)
function getDistanceTime(pickup, destination) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371 * 1000; // meters

  const dLat = toRad(destination.lat - pickup.lat);
  const dLon = toRad(destination.lon - pickup.lon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(pickup.lat)) *
      Math.cos(toRad(destination.lat)) *
      Math.sin(dLon / 2) ** 2;

  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Assume Uber avg speed ~ 30 km/h (≈ 8.3 m/s)
  const avgUberSpeed = 8.3; // meters/sec
  const duration = distance / avgUberSpeed;

  return {
    distance: { value: distance }, // in meters
    duration: { value: duration }, // in seconds
  };
}

export function calculateFare(pickup, destination) {
  const distanceTime = getDistanceTime(pickup, destination);

  const baseFare = { auto: 30, car: 50, moto: 20 };
  const perKmRate = { auto: 10, car: 15, moto: 8 };
  const perMinuteRate = { auto: 2, car: 3, moto: 1.5 };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ),
    car: Math.round(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ),
    moto: Math.round(
      baseFare.moto +
        (distanceTime.distance.value / 1000) * perKmRate.moto +
        (distanceTime.duration.value / 60) * perMinuteRate.moto
    ),
  };

  return {
    ...fare,
    distance: distanceTime.distance.value,
    duration: distanceTime.duration.value, // seconds
  };
}
