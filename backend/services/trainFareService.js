export function calculateTrainFare(distanceKm) {
  let secondClassFare = 0;
  let firstClassFare = 0;

  if (distanceKm <= 5) {
    secondClassFare = 5;
    firstClassFare = 25;
  } else if (distanceKm <= 10) {
    secondClassFare = 10;
    firstClassFare = 50;
  } else if (distanceKm <= 20) {
    secondClassFare = 15;
    firstClassFare = 75;
  } else if (distanceKm <= 30) {
    secondClassFare = 20;
    firstClassFare = 100;
  } else if (distanceKm <= 40) {
    secondClassFare = 25;
    firstClassFare = 130;
  } else if (distanceKm <= 50) {
    secondClassFare = 30;
    firstClassFare = 160;
  } else if (distanceKm <= 60) {
    secondClassFare = 40;
    firstClassFare = 190;
  } else {
    const extra = Math.ceil((distanceKm - 60) / 10);
    secondClassFare = 40 + extra * 10;
    firstClassFare = 190 + extra * 30;
  }

  return {
    secondClass: secondClassFare,
    firstClass: firstClassFare,
  };
}
