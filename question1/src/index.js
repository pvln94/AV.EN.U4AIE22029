// src/index.js
const express = require('express');
const stockRoutes = require('./routes/stockRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', stockRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});