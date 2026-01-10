import 'dotenv/config';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import pollutionRoutes from './routes/pollution.js';
import complaintRoutes from './routes/complaint.js';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MongoDB connection error: MONGO_URI is not set in environment');
  process.exit(1);
}

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

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pollution Ward API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
