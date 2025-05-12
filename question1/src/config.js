// src/config.js
const axios = require('axios');
require('dotenv').config();

const getAuthToken = async () => {
  try {
    const response = await axios.post(`${process.env.TEST_SERVER_URL}/auth`, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching auth token:', error.message);
    throw new Error('Failed to authenticate with test server');
  }
};

module.exports = { getAuthToken };