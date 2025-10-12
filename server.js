import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './backend/routes/index.js';

  console.time('require:dotenv'); //This is useful for debugging performance, but not required for production.
  import 'dotenv/config'; //This is good practice for managing secrets and config.
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