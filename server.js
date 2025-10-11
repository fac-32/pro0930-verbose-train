  console.time('startup');

  console.time('require:dotenv');
  import 'dotenv/config';
  console.timeEnd('require:dotenv');

  console.time('require:express');
  import express from 'express';
  console.timeEnd('require:express');

  console.time('require:path');
  import path from 'path';
  console.timeEnd('require:path');

  import { fileURLToPath } from 'url';

  // Import your main router
  console.time('require:router');
  import apiRouter from './backend/routes/index.js';
  console.timeEnd('require:router');

  // Get __dirname equivalent in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const app = express();
  const PORT = process.env.PORT || 3000;

  // --- Middleware ---
  app.use(express.json()); // To parse JSON bodies
  app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

  // --- Serve Frontend ---
  // This serves the static files from your frontend's public directory
  app.use(express.static(path.join(__dirname, 'frontend', 'public')));


  // --- API Routes ---
  // All backend routes will be prefixed with /api
  app.use('/api', apiRouter);

// --- Start Server ---
console.timeEnd('startup');
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
