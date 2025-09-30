require('dotenv').config();
const express = require('express');
const path = require('path');

// Import your main router
const apiRouter = require('./backend/routes/index');

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
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});

