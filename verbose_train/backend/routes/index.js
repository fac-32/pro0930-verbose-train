const express = require('express');
const router = express.Router();
const { getExampleData } = require('../controllers/exampleController');

// Define a sample route
router.get('/hello', getExampleData);

module.exports = router;

