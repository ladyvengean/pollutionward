
import { percentChange } from "../utils/math.js";

/**
 * Correlates recent pollution trends with weather & activity signals
 *
 * @param pollutionHistory Array of recent pollution readings (ordered, latest last)
 * @param weatherHistory Array of recent weather readings (ordered, latest last)
 * @param timeContextHistory Array of time context objects
 */
export function detectCorrelations({
  pollutionHistory = [],
  weatherHistory = [],
  timeContextHistory = []
}) {
  const windowSize =
    Number(process.env.CORRELATION_WINDOW_HOURS) || 6;

  const correlations = {
    trafficCorrelation: false,
    constructionCorrelation: false,
    burningCorrelation: false,
    weatherTrapCorrelation: false
  };

  if (
    pollutionHistory.length < 2 ||
    weatherHistory.length < 2
  ) {
    return correlations;
  }


  const recentPollution = pollutionHistory.slice(-windowSize);
  const recentWeather = weatherHistory.slice(-windowSize);
  const recentTime = timeContextHistory.slice(-windowSize);

  
  let trafficSignals = 0;
  let trafficMatches = 0;

  recentPollution.forEach((p, i) => {
    if (recentTime[i]?.isPeakHour) {
      trafficSignals++;
      if (percentChange(p.no2, recentPollution[i - 1]?.no2) > 0) {
        trafficMatches++;
      }
    }
  });

  if (
    trafficSignals > 0 &&
    trafficMatches / trafficSignals >=
      Number(process.env.CORRELATION_THRESHOLD)
  ) {
    correlations.trafficCorrelation = true;
  }

  
  let constructionSignals = 0;
  let constructionMatches = 0;

  recentPollution.forEach((p, i) => {
    if (
      recentTime[i]?.isDaytime &&
      recentWeather[i]?.humidity < 50
    ) {
      constructionSignals++;
      if (percentChange(p.pm10, recentPollution[i - 1]?.pm10) > 0) {
        constructionMatches++;
      }
    }
  });

  if (
    constructionSignals > 0 &&
    constructionMatches / constructionSignals >=
      Number(process.env.CORRELATION_THRESHOLD)
  ) {
    correlations.constructionCorrelation = true;
  }


  let burningSignals = 0;
  let burningMatches = 0;

  recentPollution.forEach((p, i) => {
    if (recentTime[i]?.isNight) {
      burningSignals++;
      if (percentChange(p.pm25, recentPollution[i - 1]?.pm25) > 20) {
        burningMatches++;
      }
    }
  });

  if (
    burningSignals > 0 &&
    burningMatches / burningSignals >=
      Number(process.env.CORRELATION_THRESHOLD)
  ) {
    correlations.burningCorrelation = true;
  }


  let trapSignals = 0;
  let trapMatches = 0;

  recentPollution.forEach((p, i) => {
    if (recentWeather[i]?.windSpeed <= 1) {
      trapSignals++;
      if (
        percentChange(p.pm25, recentPollution[i - 1]?.pm25) >= 0
      ) {
        trapMatches++;
      }
    }
  });

  if (
    trapSignals > 0 &&
    trapMatches / trapSignals >=
      Number(process.env.CORRELATION_THRESHOLD)
  ) {
    correlations.weatherTrapCorrelation = true;
  }

  return correlations;
}
