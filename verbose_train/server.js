console.time('startup');

console.time('require:dotenv');
require('dotenv').config();
console.timeEnd('require:dotenv');

console.time('require:express');
const express = require('express');
console.timeEnd('require:express');

console.time('require:path');
const path = require('path');
console.timeEnd('require:path');

// Import your main router
console.time('require:router');
const apiRouter = require('./backend/routes/index');
console.timeEnd('require:router');

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

