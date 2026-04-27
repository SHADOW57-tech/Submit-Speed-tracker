import 'dotenv/config'; // Modern way to load dotenv
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js'; // Note the .js extension is REQUIRED in ESM
import shipmentRoutes from './routes/shipmentRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import updateRoutes from './routes/updateRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/shipments', shipmentRoutes);
app.use('/api/shipments', updateRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server flying on port ${PORT}`));