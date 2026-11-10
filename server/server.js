import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Files Statically
const uploadsPath = path.resolve('uploads');
app.use('/uploads', express.static(uploadsPath));

// Health Check API
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'IEM Admission Portal REST API Server',
    status: 'Active',
    session: '2026-2027',
    institution: 'Institute of Engineering & Management, Kolkata'
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [Server Running]: IEM Admission Portal backend listening on port ${PORT}`);
  console.log(`🔗 [API Base URL]: http://localhost:${PORT}/api`);
});
