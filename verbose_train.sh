#!/bin/bash

# A script to generate a full-stack project structure with a separate frontend and backend.

echo "🚀 Creating a new full-stack project..."
read -p "Enter project name (default: my-app): " PROJECT_NAME

# Use 'my-app' as default if no name is provided
PROJECT_NAME=${PROJECT_NAME:-my-app}

# --- Create Root Directory and Files ---
mkdir "$PROJECT_NAME"
cd "$PROJECT_NAME"

echo "✅ Created root folder: $PROJECT_NAME"

# --- Create Top-Level Files ---
touch server.js .env

# Create package.json with a start script
echo "{
  \"name\": \"$PROJECT_NAME\",
  \"version\": \"1.0.0\",
  \"description\": \"A full-stack web application\",
  \"main\": \"server.js\",
  \"scripts\": {
    \"start\": \"node server.js\"
  },
  \"keywords\": [],
  \"author\": \"\",
  \"license\": \"ISC\",
  \"dependencies\": {
    \"dotenv\": \"^16.0.0\",
    \"express\": \"^4.18.0\"
  }
}" > package.json

# Create .env file with a default port
echo "PORT=3000
" > .env

# Create the main server.js entry point
echo "require('dotenv').config();
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
  console.log(\`✅ Server is running at http://localhost:\${PORT}\`);
});
" > server.js

echo "✅ Created top-level files: server.js, package.json, .env"

# --- Create Backend Structure ---
mkdir -p backend/routes backend/controllers backend/services backend/middleware backend/utils

# Create placeholder files in the backend
touch backend/routes/index.js
touch backend/controllers/exampleController.js
touch backend/services/exampleService.js
touch backend/middleware/exampleMiddleware.js
touch backend/utils/helpers.js

# Add boilerplate to the main router
echo "const express = require('express');
const router = express.Router();
const { getExampleData } = require('../controllers/exampleController');

// Define a sample route
router.get('/hello', getExampleData);

module.exports = router;
" > backend/routes/index.js

# Add boilerplate to the controller
echo "const exampleService = require('../services/exampleService');

const getExampleData = (req, res) => {
    try {
        const data = exampleService.fetchData();
        res.json({ message: 'Success!', data });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = { getExampleData };
" > backend/controllers/exampleController.js

echo "✅ Created backend structure in /backend"

# --- Create Frontend Structure ---
mkdir -p frontend/public frontend/src

# Create placeholder files for the frontend
touch frontend/public/index.html
touch frontend/public/style.css
touch frontend/src/app.js

# Add boilerplate to index.html
echo "<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>$PROJECT_NAME</title>
    <link rel=\"stylesheet\" href=\"style.css\">
</head>
<body>
    <h1>Welcome to $PROJECT_NAME</h1>
    <p>Your frontend is being served from the 'public' directory.</p>
    <script src=\"../src/app.js\"></script>
</body>
</html>" > frontend/public/index.html

echo "✅ Created frontend structure in /frontend"

# --- Final Instructions ---
echo ""
echo "🎉 Project '$PROJECT_NAME' created successfully!"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. Install dependencies: npm install"
echo "3. Start the server: npm start"
echo "4. Open http://localhost:3000 in your browser."
echo "Happy coding!"