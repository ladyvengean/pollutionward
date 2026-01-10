import express from 'express';
import cors from 'cors';
import pollutionRoutes from './routes/pollution.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', pollutionRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Pollution Ward API is running' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
