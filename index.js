require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Environment variables
const KYLAS_API_KEY = process.env.KYLAS_API_KEY;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

// API endpoint to handle form submissions
app.post('/api/submit-form', async (req, res) => {
  try {
    // Get form data from request body
    const formData = req.body;
    
    // Make the API call to Kylas
    const response = await axios.post('https://api.kylas.io/v1/leads/', formData, {
      headers: {
        'Content-Type': 'application/json',
        'api-key': KYLAS_API_KEY
      }
    });
    
    // Return the response from Kylas
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || 'An error occurred while submitting the form'
    });
  }
});

// Add a health check endpoint
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Set up the keep-alive mechanism
  setupKeepAlive();
});

// Function to prevent the server from spinning down
function setupKeepAlive() {
  // Self-ping every 14 minutes (840,000 ms)
  // This is just under the 15-minute inactivity threshold
  const interval = 840000;
  
  console.log(`Setting up keep-alive ping every ${interval/60000} minutes to ${APP_URL}/ping`);
  
  setInterval(() => {
    https.get(`${APP_URL}/ping`, (res) => {
      console.log(`Keep-alive ping sent. Status: ${res.statusCode}`);
    }).on('error', (err) => {
      console.error('Error sending keep-alive ping:', err.message);
    });
    
    // As a backup, also log something to keep the process active
    console.log(`[${new Date().toISOString()}] Keep-alive ping`);
  }, interval);
}
