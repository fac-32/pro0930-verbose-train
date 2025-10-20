import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './backend/routes/index.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve Frontend ---
app.use(express.static(path.join(__dirname, 'frontend', 'public')));
app.use('/src', express.static(path.join(__dirname, 'frontend', 'src')));

// --- API Routes ---
app.use('/api', apiRouter);

export default app;
