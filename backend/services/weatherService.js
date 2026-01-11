import axios from "axios";

export async function getDelhiWeather() {
  try {
    const response = await axios.get(
      `${process.env.OPEN_METEO_BASE_URL}/forecast`,
      {
        params: {
          latitude: process.env.DELHI_LAT,
          longitude: process.env.DELHI_LON,
          hourly: "temperature_2m,relative_humidity_2m,wind_speed_10m",
          current_weather: true,
          timezone: process.env.WEATHER_TIMEZONE
        }
      }
    );

    const data = response.data;

    if (!data?.current_weather) {
      throw new Error("Invalid weather API response");
    }

    // Safe index resolution
    const hourIndex =
      data.hourly?.time?.indexOf(data.current_weather.time) ?? -1;

    return {
      temperature: data.current_weather.temperature,
      windSpeed: data.current_weather.windspeed,
      humidity:
        hourIndex >= 0
          ? data.hourly.relative_humidity_2m[hourIndex]
          : null,
      timestamp: data.current_weather.time
    };
  } catch (error) {
    console.error("[WeatherService] Failed to fetch weather:", error.message);
    throw new Error("Weather service unavailable");
  }
}
