
import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/pollution", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "lat and lon are required" });
    }

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=64bb27bd8bf985127328261759c374d9faca50da`;

    console.log("Fetching AQICN:", url);

    const response = await axios.get(url);

    if (response.data.status !== "ok") {
      return res.status(500).json({
        error: "AQICN returned error",
        details: response.data,
      });
    }

    const data = response.data.data;

    res.json({
      pm25: data.iaqi?.pm25?.v ?? null,
      pm10: data.iaqi?.pm10?.v ?? null,
      aqi: data.aqi,
      city: data.city?.name,
      dominantPollutant: data.dominantpol,
      source: "AQICN",
    });
  } catch (err) {
    console.error("AQICN ERROR:", err.message);

    res.status(500).json({
      error: "Failed to fetch pollution data",
      details: err.message,
    });
  }
});

export default router;
