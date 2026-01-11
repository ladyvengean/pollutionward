import express from "express";
import DailyPollutionSummary from "../models/DailyPollutionSummary.js";
import DailyWeatherSummary from "../models/DailyWeatherSummary.js";
import { WARD_MAP } from "../data/wardMap.js";

const router = express.Router();

router.get("/wards/:wardId", async (req, res) => {
  try {
    const { wardId } = req.params;

    const name = WARD_MAP[wardId];
    if (!name) {
      return res.status(404).json({ error: "Unknown ward" });
    }

    const today = new Date().toISOString().slice(0, 10);

    /* --- Pollution --- */
    const pollution = await DailyPollutionSummary.findOne({
      ward_id: wardId,
      date: today
    });

    if (!pollution) {
      return res.status(404).json({ error: "No pollution data for ward" });
    }

    const aqi = Math.max(
      pollution.pm25.avg * 1.2,
      pollution.pm10.avg * 0.8
    );

    const status =
      aqi <= 50 ? "good" :
      aqi <= 100 ? "moderate" :
      aqi <= 200 ? "poor" : "severe";

    /* --- Weather (city-level fallback) --- */
    const weather = await DailyWeatherSummary.findOne({ date: today });

    /* --- Response --- */
    res.json({
      name,
      aqi: Math.round(aqi),
      status,
      cityAvgAQI: 160, // can be computed later
      weather: {
        temperature: 30,
        humidity: weather?.avg_humidity ?? 60,
        windSpeed: weather?.avg_wind_speed ?? 7,
        visibility: 5
      },
      trendData: [
        {
          date: today,
          aqi: Math.round(aqi),
          cityAvg: 160
        }
      ],
      insights: [
        {
          title: "PM2.5 Levels",
          description: `Average PM2.5 today is ${Math.round(pollution.pm25.avg)} µg/m³`
        },
        {
          title: "PM10 Contribution",
          description: `Construction dust contributing to PM10 of ${Math.round(pollution.pm10.avg)} µg/m³`
        }
      ]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load ward data" });
  }
});

export default router;
