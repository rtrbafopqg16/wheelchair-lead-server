require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Environment variables
const KYLAS_API_KEY = process.env.KYLAS_API_KEY;

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



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});