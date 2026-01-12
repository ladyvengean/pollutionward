import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import pollutionRoutes from './routes/pollution.js';
import complaintRoutes from './routes/complaint.js';
import dotenv from "dotenv";
import attributionRoutes from "./routes/attributionRoutes.js";
import { connectDB } from "./config/db.js";
import { startSchedulers } from "./services/schedulerService.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MongoDB connection error: MONGO_URI is not set in environment');
  process.exit(1);
}
connectDB();
startSchedulers();

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api', pollutionRoutes);
app.use('/api', complaintRoutes);
app.use("/api/attribution", attributionRoutes);

app.use("/api/notifications", notificationRoutes);

import recommendationRoutes from "./routes/recommendationRoutes.js";

app.use("/recommendations", recommendationRoutes);



// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pollution Ward API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
