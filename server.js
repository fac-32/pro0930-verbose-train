import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './backend/routes/index.js';

console.log('Starting server...');

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3002;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Serve Frontend ---
// This must come before the API routes
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// --- API Routes ---
app.use('/api', apiRouter);

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});