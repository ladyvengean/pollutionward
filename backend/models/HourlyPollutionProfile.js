import mongoose from "mongoose";

const HourlyPollutionProfileSchema = new mongoose.Schema({
  ward_id: { type: String, required: true },
  date: { type: String, required: true },

  hourly_pm25: {
    type: Map,
    of: Number
  }
}, { timestamps: true });

export default mongoose.model(
  "HourlyPollutionProfile",
  HourlyPollutionProfileSchema
);
