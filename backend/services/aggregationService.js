
import DailyPollutionSummary from "../models/DailyPollutionSummary.js";
import HourlyPollutionProfile from "../models/HourlyPollutionProfile.js";
import SourceAttributionSnapshot from "../models/SourceAttributionSnapshot.js";
import DailyWeatherSummary from "../models/DailyWeatherSummary.js";

import { average } from "../utils/math.js";

function getDateKey(timestamp) {
  return new Date(timestamp).toISOString().split("T")[0];
}


function getHourKey(timestamp) {
  return new Date(timestamp).getHours().toString().padStart(2, "0");
}


export async function updateHourlyProfile({ ward_id, pollution }) {
  const date = getDateKey(pollution.timestamp);
  const hour = getHourKey(pollution.timestamp);

  const doc = await HourlyPollutionProfile.findOneAndUpdate(
    { ward_id, date },
    {
      $set: {
        [`hourly_pm25.${hour}`]: pollution.pm25
      }
    },
    { upsert: true, new: true }
  );

  return doc;
}

export async function updateDailyPollutionSummary({
  ward_id,
  pollutionSamples
}) {
 
  const date = getDateKey(pollutionSamples[0].timestamp);

  const pm25Values = pollutionSamples.map(p => p.pm25);
  const pm10Values = pollutionSamples.map(p => p.pm10);
  const no2Values = pollutionSamples.map(p => p.no2);

  const summary = {
    ward_id,
    date,
    pm25: {
      avg: average(pm25Values),
      max: Math.max(...pm25Values),
      min: Math.min(...pm25Values)
    },
    pm10: {
      avg: average(pm10Values),
      max: Math.max(...pm10Values),
      min: Math.min(...pm10Values)
    },
    no2: {
      avg: average(no2Values),
      max: Math.max(...no2Values),
      min: Math.min(...no2Values)
    }
  };

  return await DailyPollutionSummary.findOneAndUpdate(
    { ward_id, date },
    summary,
    { upsert: true, new: true }
  );
}

export async function saveSourceAttributionSnapshot({
  ward_id,
  timestamp,
  sources,
  confidence
}) {
  const date = getDateKey(timestamp);

  return await SourceAttributionSnapshot.findOneAndUpdate(
    { ward_id, date },
    {
      ward_id,
      date,
      sources,
      confidence
    },
    { upsert: true, new: true }
  );
}


export async function updateDailyWeatherSummary({
  timestamp,
  weatherSamples
}) {


  const date = getDateKey(timestamp);

  const windValues = weatherSamples.map(w => w.windSpeed);
  const humidityValues = weatherSamples.map(w => w.humidity);

  const summary = {
    date,
    avg_wind_speed: average(windValues),
    min_wind_speed: Math.min(...windValues),
    avg_humidity: average(humidityValues)
  };

  return await DailyWeatherSummary.findOneAndUpdate(
    { date },
    summary,
    { upsert: true, new: true }
  );
}
