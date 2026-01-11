import mongoose from "mongoose";

const DailyWeatherSummarySchema = new mongoose.Schema({
  date: { type: String, required: true },

  avg_wind_speed: Number,
  min_wind_speed: Number,
  avg_humidity: Number
}, { timestamps: true });

export default mongoose.model(
  "DailyWeatherSummary",
  DailyWeatherSummarySchema
);
