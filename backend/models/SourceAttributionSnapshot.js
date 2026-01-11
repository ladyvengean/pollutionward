import mongoose from "mongoose";

const SourceAttributionSchema = new mongoose.Schema({
  ward_id: { type: String, required: true },
  date: { type: String, required: true },

  sources: {
    traffic: Number,
    construction: Number,
    waste_burning: Number,
    industry_dg: Number,
    weather_trap: Number
  },

  confidence: {
    type: String,
    enum: ["Low", "Medium", "High"]
  }
}, { timestamps: true });

export default mongoose.model(
  "SourceAttributionSnapshot",
  SourceAttributionSchema
);
