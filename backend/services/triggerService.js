
import { percentChange } from "../utils/math.js";

export function detectTriggers({ pollution, weather, history }) {
  if (!pollution || !weather) {
    throw new Error("Missing pollution or weather data for trigger detection");
  }

  const {
    pm25 = 0,
    pm10 = 0,
    timestamp
  } = pollution;

  const {
    windSpeed = 0
  } = weather;

  const triggers = {
    pm25Spike: false,
    pm10Spike: false,
    suddenEvent: false,
    dispersionRisk: false,
    nightActivity: false,
    highRiskEvent: false
  };

 
  if (history?.pm25) {
    const change = percentChange(pm25, history.pm25);
    if (change >= Number(process.env.PM25_SPIKE_PERCENT)) {
      triggers.pm25Spike = true;
      triggers.suddenEvent = true;
    }
  }

  if (history?.pm10) {
    const change = percentChange(pm10, history.pm10);
    if (change >= Number(process.env.PM10_SPIKE_PERCENT)) {
      triggers.pm10Spike = true;
      triggers.suddenEvent = true;
    }
  }

  if (windSpeed <= Number(process.env.LOW_WIND_THRESHOLD)) {
    triggers.dispersionRisk = true;
  }


  if (timestamp) {
    const hour = new Date(timestamp).getHours();
    const nightStart = Number(process.env.NIGHT_START_HOUR);
    const nightEnd = Number(process.env.NIGHT_END_HOUR);

    if (hour >= nightStart || hour <= nightEnd) {
      triggers.nightActivity = true;
    }
  }

  
  if (
    triggers.suddenEvent &&
    triggers.dispersionRisk &&
    triggers.nightActivity
  ) {
    triggers.highRiskEvent = true;
  }

  return triggers;
}
