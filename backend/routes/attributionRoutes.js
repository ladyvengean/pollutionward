



import express from "express";
import { attributeSources } from "../services/attributionService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { ward_id } = req.query;

    if (!ward_id) {
      return res.status(400).json({ error: "ward_id is required" });
    }

    const result = await attributeSources({ ward_id });


    return res.json({
      ward: result.ward,
      aqi: result.aqi,
      aqi_category: result.aqi_category,
      pollutants: result.pollutants,           
      dominant_pollutant: result.dominant_pollutant,
      weather: result.weather,
      precautions: result.precautions,
      recommendation: result.recommendation,
      priority: result.priority,
      confidence: result.confidence,
      station_name: result.station_name,
      station_distance_km: result.station_distance_km,
      last_updated: result.last_updated
    });
    
  } catch (error) {
    console.error("[Attribution Route Error]", error.message);

    return res.status(500).json({
      error: "Attribution failed",
      details: error.message
    });
  }
});

export default router;