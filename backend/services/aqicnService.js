


import axios from "axios";


export async function fetchDelhiStations() {
  const token = process.env.AQICN_API_TOKEN;

  if (!token) {
    throw new Error("AQICN_API_TOKEN not set in environment variables");
  }

  try {
    const response = await axios.get(
      "https://api.waqi.info/map/bounds/",
      {
        params: {
          // Delhi bounding box: south, west, north, east
          latlng: "28.40,76.85,28.90,77.40",
          token
        },
        timeout: 15000
      }
    );

    if (response.data.status !== "ok") {
      throw new Error(`AQICN API Error: ${response.data.data || 'Unknown error'}`);
    }

    // Normalize station data with enhanced fields
    const stations = response.data.data
      .filter(
        s =>
          s.aqi !== "-" &&
          typeof s.lat === "number" &&
          typeof s.lon === "number"
      )
      .map(s => ({
        station_id: s.uid,  // Unique station ID for detailed queries
        station_name: s.station?.name || "Unknown Station",
        aqi: Number(s.aqi),
        latitude: s.lat,
        longitude: s.lon,
        // Identify data source (CPCB, US Embassy, etc.)
        is_cpcb: s.station?.name?.toLowerCase().includes('cpcb') || false,
        is_embassy: s.station?.name?.toLowerCase().includes('embassy') || false
      }));

    if (!stations.length) {
      throw new Error("No valid stations found in Delhi bounds");
    }

    return stations;
  } catch (error) {
    console.error(
      "[AQICN Service Error]",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch AQICN station data");
    return [];
  }
}

/**
 * Fetch detailed pollution and weather data for a specific station
 * This provides ALL pollutants (PM2.5, PM10, NO2, SO2, CO, O3) + weather
 * Use station_id from fetchDelhiStations() or use @{id} format
 */
export async function fetchStationDetails(stationId) {
  const token = process.env.AQICN_API_TOKEN;

  if (!token) {
    throw new Error("AQICN_API_TOKEN not set");
  }

  try {
    // Station ID can be just number or @number format
    const formattedId = stationId.toString().startsWith('@') 
      ? stationId 
      : `@${stationId}`;

    const response = await axios.get(
      `https://api.waqi.info/feed/${formattedId}/`,
      {
        params: { token },
        timeout: 15000
      }
    );

    if (response.data.status !== "ok") {
      throw new Error(`Station ${stationId} not found or API error`);
    }

    const data = response.data.data;

    // Extract pollutant data
    const pollutants = {
      pm25: extractPollutant(data, 'pm25'),
      pm10: extractPollutant(data, 'pm10'),
      no2: extractPollutant(data, 'no2'),
      so2: extractPollutant(data, 'so2'),
      co: extractPollutant(data, 'co'),
      o3: extractPollutant(data, 'o3')
    };

    // Extract weather data
    const weather = {
      temperature: data.iaqi?.t?.v || null,
      humidity: data.iaqi?.h?.v || null,
      pressure: data.iaqi?.p?.v || null,
      wind_speed: data.iaqi?.w?.v || null,
      dew_point: data.iaqi?.d?.v || null
    };

    // Build comprehensive response
    return {
      station_id: data.idx,
      station_name: data.city?.name || "Unknown",
      aqi: data.aqi,
      dominant_pollutant: data.dominentpol || null,
      latitude: data.city?.geo?.[0] || null,
      longitude: data.city?.geo?.[1] || null,
      
      // All pollutant measurements
      pollutants,
      
      // Weather data
      weather,
      
      // Metadata
      timestamp: data.time?.iso || new Date().toISOString(),
      timezone: data.time?.tz || null,
      attributions: data.attributions || [],
      
      // Health and recommendations
      forecast: data.forecast || null,
      
      // Source identification
      is_cpcb: data.city?.name?.toLowerCase().includes('cpcb') || false
    };
  } catch (error) {
    console.error(`[Station Details Error - ${stationId}]`, error.message);
    throw new Error(`Failed to fetch details for station ${stationId}`);
    return null;
  }
}

/**
 * Fetch detailed data for ALL Delhi stations
 * Warning: This makes many API calls (one per station)
 * Use with rate limiting or caching
 */
export async function fetchAllDelhiStationsDetails() {
  const stations = await fetchDelhiStations();
  
  const detailedStations = [];
  const errors = [];

  for (const station of stations) {
    try {
      const details = await fetchStationDetails(station.station_id);
      detailedStations.push(details);
      
      // Rate limiting: wait 100ms between requests to avoid overwhelming API
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      errors.push({
        station_id: station.station_id,
        error: error.message
      });
    }
  }

  return {
    stations: detailedStations,
    total: detailedStations.length,
    errors: errors.length ? errors : null
  };
}

/**
 * Fetch only CPCB stations with full details
 * This replaces the old CPCB service entirely
 */
export async function fetchCPCBStationsOnly() {
  const allStations = await fetchDelhiStations();
  
  // Filter for CPCB stations only
  const cpcbStations = allStations.filter(s => s.is_cpcb);

  console.log(`Found ${cpcbStations.length} CPCB stations out of ${allStations.length} total`);

  // Fetch detailed data for each CPCB station
  const detailedCPCB = [];
  
  for (const station of cpcbStations) {
    try {
      const details = await fetchStationDetails(station.station_id);
      detailedCPCB.push(details);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to fetch CPCB station ${station.station_id}:`, error.message);
    }
  }

  return detailedCPCB;
}

/**
 * Fetch Delhi city-level data (main station)
 * Fastest option for getting quick Delhi overview
 */
export async function fetchDelhiCityData() {
  const token = process.env.AQICN_API_TOKEN;

  if (!token) {
    throw new Error("AQICN_API_TOKEN not set");
  }

  try {
    const response = await axios.get(
      "https://api.waqi.info/feed/delhi/",
      {
        params: { token },
        timeout: 15000
      }
    );

    if (response.data.status !== "ok") {
      throw new Error("Failed to fetch Delhi city data");
    }

    const data = response.data.data;

    return {
      city: "Delhi",
      aqi: data.aqi,
      dominant_pollutant: data.dominentpol,
      pollutants: {
        pm25: extractPollutant(data, 'pm25'),
        pm10: extractPollutant(data, 'pm10'),
        no2: extractPollutant(data, 'no2'),
        so2: extractPollutant(data, 'so2'),
        co: extractPollutant(data, 'co'),
        o3: extractPollutant(data, 'o3')
      },
      timestamp: data.time?.iso
    };
  } catch (error) {
    console.error("[Delhi City Data Error]", error.message);
    throw new Error("Failed to fetch Delhi city data");
  }
}

/**
 * Utility function to extract pollutant data from AQICN response
 * AQICN uses 'iaqi' object for individual pollutant measurements
 */
function extractPollutant(data, pollutant) {
  if (!data.iaqi || !data.iaqi[pollutant]) {
    return null;
  }

  return {
    value: data.iaqi[pollutant].v,
    aqi: calculatePollutantAQI(pollutant, data.iaqi[pollutant].v)
  };
}


function calculatePollutantAQI(pollutant, value) {
  
  return value;
}


export function normalizeToCPCBFormat(aqicnData) {
  return aqicnData.map(station => ({
    station_name: station.station_name,
    state: "Delhi",
    city: "Delhi",
    pollutants: {
      pm25: station.pollutants?.pm25?.value || null,
      pm10: station.pollutants?.pm10?.value || null,
      no2: station.pollutants?.no2?.value || null,
      so2: station.pollutants?.so2?.value || null,
      co: station.pollutants?.co?.value || null,
      o3: station.pollutants?.o3?.value || null
    },
    aqi: station.aqi,
    last_update: station.timestamp,
    latitude: station.latitude,
    longitude: station.longitude
  }));
}