import fs from "fs";
import path from "path";
import { fetchDelhiStations, fetchStationDetails } from "./aqicnService.js";
import { haversineDistance } from "../utils/math.js";
import { generateExplanation } from "./explanationService.js";
import { getConfidenceScore } from "./confidenceService.js";
import { generateStructuredRecommendations } from "./recommendationEngine.js";



import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wardConfigPath = path.join(__dirname, "../config/wardConfig.json");
const wards = JSON.parse(fs.readFileSync(wardConfigPath, "utf-8"));



function findNearestStation(ward, stations) {
  let nearest = null;
  let minDistance = Infinity;

  for (const station of stations) {
    if (!station.latitude || !station.longitude) continue;

    const distance = haversineDistance(
      ward.lat,
      ward.lon,
      station.latitude,
      station.longitude
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...station, distance };
    }
  }

  return nearest;
}

function getAQICategory(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 200) return "Poor";
  if (aqi <= 300) return "Very Poor";
  return "Severe";
}

function extractPollutants(pollutants = {}) {
  return {
    pm25: pollutants.pm25?.value ?? null,
    pm10: pollutants.pm10?.value ?? null,
    no2: pollutants.no2?.value ?? null,
    so2: pollutants.so2?.value ?? null,
    co: pollutants.co?.value ?? null,
    o3: pollutants.o3?.value ?? null
  };
}

function generateRecommendation(aqi, zone) {
  let recommendation = "";

  if (aqi > 300) {
    recommendation =
      "Restrict outdoor activities and enforce emergency pollution controls";
  } else if (aqi > 200) {
    recommendation =
      "Reduce vehicular and industrial emissions immediately";
  } else if (aqi > 100) {
    recommendation =
      "Encourage public transport usage and limit dust-generating activities";
  } else {
    recommendation =
      "Air quality is acceptable; maintain preventive measures";
  }

  if (zone === "Industrial") {
    recommendation += " with focused inspections in industrial clusters";
  } else if (zone === "Residential") {
    recommendation +=
      " with emphasis on community awareness and health safety";
  }

  return recommendation;
}

  

/* -------------------- Main Attribution Function -------------------- */

export async function attributeSources({ ward_id }) {
  const ward = wards.find(w => w.ward_id === ward_id);
  if (!ward) {
    throw new Error("Invalid ward_id");
  }

  // Step 1: Get all stations (basic data only)
  const stations = await fetchDelhiStations();
  if (!stations.length) {
    throw new Error("No AQICN monitoring stations available");
  }

  // Step 2: Find nearest station
  const nearestStation = findNearestStation(ward, stations);
  if (!nearestStation) {
    throw new Error("No monitoring station available for this ward");
  }

  // Step 3: Fetch DETAILED data for that specific station
  const stationDetails = await fetchStationDetails(nearestStation.station_id);

  const aqi = Number(stationDetails.aqi);
  
  const category = getAQICategory(aqi);

  const pollutants = extractPollutants(stationDetails.pollutants);

  /* -------------------- WEATHER LOGIC (ADDED, NON-INTRUSIVE) -------------------- */

  const weather = stationDetails.weather || {};
  const weatherImpact = {
    poorDispersion: false,
    highHumidity: false
  };

  if (typeof weather.windSpeed === "number" && weather.windSpeed < 1.5) {
    weatherImpact.poorDispersion = true;
  }

  if (typeof weather.humidity === "number" && weather.humidity > 70) {
    weatherImpact.highHumidity = true;
  }

  /* -------------------- RECOMMENDATION (AUGMENTED) -------------------- */

  let recommendation = generateRecommendation(aqi, ward.zone);

  if (weatherImpact.poorDispersion && aqi > 150) {
    recommendation +=
      ". Unfavourable meteorological conditions are preventing dispersion of pollutants";
  }

  if (weatherImpact.highHumidity && aqi > 150) {
    recommendation +=
      ", and high humidity may be increasing particulate persistence";
  }
  const structuredRecommendations = generateStructuredRecommendations({
    aqi,
    dominant_pollutant: stationDetails.dominant_pollutant,
    zone: ward.zone,
    weather: stationDetails.weather
  });
  

  /* -------------------- EXPLANATION -------------------- */

  const explanation = generateExplanation({
    ward,
    station: {
      name: stationDetails.station_name,
      distance: nearestStation.distance.toFixed(2),
      pollutants,
      weatherImpact
    },
    category
  });

  /* -------------------- PRIORITY (WEATHER-AWARE ESCALATION) -------------------- */

  let priority = aqi > 200 ? "High" : aqi > 100 ? "Medium" : "Low";

  if (aqi > 150 && weatherImpact.poorDispersion) {
    priority = "High";
  }

  const confidence = getConfidenceScore({
    source: "AQICN",
    distance: nearestStation.distance
  });

  return {
    ward: ward.name,
    aqi,
    aqi_category: category,
    pollutants,
    dominant_pollutant: stationDetails.dominant_pollutant,
    weather: stationDetails.weather,
    precautions: explanation,
    recommendation,
    recommendations: structuredRecommendations,
    priority,
    confidence,
    station_name: stationDetails.station_name,
    station_distance_km: nearestStation.distance.toFixed(2),
    last_updated: stationDetails.timestamp
  };
}
