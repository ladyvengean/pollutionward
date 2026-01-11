import mongoose from "mongoose";

const DailyPollutionSummarySchema = new mongoose.Schema({
  ward_id: { type: String, required: true },
  date: { type: String, required: true },

  pm25: {
    avg: Number,
    max: Number,
    min: Number
  },

  pm10: {
    avg: Number,
    max: Number,
    min: Number
  },

  no2: {
    avg: Number,
    max: Number,
    min: Number
  }
}, { timestamps: true });

export default mongoose.model(
  "DailyPollutionSummary",
  DailyPollutionSummarySchema
);
