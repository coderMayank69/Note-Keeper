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
  ? { credentials: true } 
  : { origin: 'http://localhost:5173', credentials: true };
app.use(cors(corsOptions));
app.use(express.json());

const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl).catch(err => console.error('Mongo connection error:', err));

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
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
