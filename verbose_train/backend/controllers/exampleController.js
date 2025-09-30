const exampleService = require('../services/exampleService');

const getExampleData = (req, res) => {
    try {
        const data = exampleService.fetchData();
        res.json({ message: 'Success!', data });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred', error: error.message });
    }
};

module.exports = { getExampleData };

