export function calculateBusFare(distanceKm, isAC = false) {
  let nonACFare = 0;
  let acFare = 0;

  if (distanceKm <= 5) {
    nonACFare = 10;
    acFare = 12;
  } else if (distanceKm <= 10) {
    nonACFare = 15;
    acFare = 20;
  } else if (distanceKm <= 15) {
    nonACFare = 20;
    acFare = 30;
  } else if (distanceKm <= 20) {
    nonACFare = 30;
    acFare = 35;
  } else if (distanceKm <= 25) {
    nonACFare = 35;
    acFare = 40;
  } else if (distanceKm <= 30) {
    nonACFare = 40;
    acFare = 45;
  } else if (distanceKm <= 35) {
    nonACFare = 45;
    acFare = 50;
  } else if (distanceKm <= 40) {
    nonACFare = 50;
    acFare = 55;
  } else if (distanceKm <= 45) {
    nonACFare = 55;
    acFare = 60;
  } else if (distanceKm <= 50) {
    nonACFare = 60;
    acFare = 65;
  } else {
    const extra = Math.ceil((distanceKm - 50) / 5) * 5;
    nonACFare = 60 + extra;
    acFare = 65 + extra;
  }

  return {
    nonAC: nonACFare,
    ac: acFare,
    selected: isAC ? acFare : nonACFare,
  };
}
