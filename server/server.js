import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import noteRouter from './routes/noteRoutes.js';
import authRouter from './routes/authRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS - in production, frontend is served from same origin
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: true, credentials: true }
  : { origin: 'http://localhost:5173', credentials: true };
app.use(cors(corsOptions));
app.use(express.json());

const dbUrl = process.env.DB_URL;

// --- Robust MongoDB Atlas Connection ---
const mongoOptions = {
  serverSelectionTimeoutMS: 10000,  // 10s to find a server
  socketTimeoutMS: 45000,           // 45s socket timeout
  maxPoolSize: 10,                  // max connections in pool
  minPoolSize: 2,                   // keep at least 2 connections open
  heartbeatFrequencyMS: 10000,      // check server health every 10s
};

const connectDB = async () => {
  try {
    await mongoose.connect(dbUrl, mongoOptions);
    console.log('✅ Database connected to Atlas');
  } catch (err) {
    console.error('❌ Initial MongoDB connection failed:', err.message);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

const db = mongoose.connection;

db.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

db.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
  setTimeout(connectDB, 5000);
});

db.on('reconnected', () => {
  console.log('✅ MongoDB reconnected successfully');
});

db.on('close', () => {
  console.warn('⚠️  MongoDB connection closed');
});

// app.use(session({
//   secret: 'foo',
//   // store: MongoStore.create(options)
// }));

// API routes

app.use('/api', noteRouter);
app.use('/api/auth', authRouter);

// Serve static files from React build
app.use(express.static(path.join(__dirname, './client-build')));

// Catch-all: serve React index.html for any non-API route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, './client-build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
