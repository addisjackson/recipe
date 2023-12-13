const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const routes = require('./routes/route');

const app = express();

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse incoming URL-encoded requests
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(helmet()); // Set various HTTP headers to secure the app
app.use(compression()); // Compress HTTP responses to improve performance

// Mounting routes
app.use('/api', routes); // Mount the routes defined in routes.js under '/api'

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// 404 Route
app.use((req, res) => {
  res.status(404).send('Route not found!');
});


module.exports = app; // Export the Express app for testing or other uses
