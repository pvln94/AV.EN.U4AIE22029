require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const TEST_SERVER_BASE_URL = process.env.TEST_SERVER_BASE_URL;

// Authorization middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Get average stock price
app.get('/stocks/:ticker', authMiddleware, async (req, res) => {
  try {
    const { ticker } = req.params;
    const { minutes = 60, aggregation = 'average' } = req.query;
    
    const response = await axios.get(`${TEST_SERVER_BASE_URL}/stocks/${ticker}?minutes=${minutes}`, {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    });
    
    const priceHistory = Array.isArray(response.data) ? response.data : [response.data.stock];
    const prices = priceHistory.map(item => item.price);
    const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    res.json({
      averageStockPrice: averagePrice,
      priceHistory
    });
  } catch (error) {
    console.error('Error fetching stock data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

// Get stock correlation
app.get('/stockcorrelation', authMiddleware, async (req, res) => {
  try {
    const { minutes = 60, ticker } = req.query;
    
    if (!ticker || !Array.isArray(ticker)) {
      return res.status(400).json({ error: 'Exactly two tickers are required' });
    }
    
    if (ticker.length !== 2) {
      return res.status(400).json({ error: 'Exactly two tickers are required' });
    } 
    
    const [ticker1, ticker2] = ticker;
    
    const [stock1Data, stock2Data] = await Promise.all([
      axios.get(`${TEST_SERVER_BASE_URL}/stocks/${ticker1}?minutes=${minutes}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      }),
      axios.get(`${TEST_SERVER_BASE_URL}/stocks/${ticker2}?minutes=${minutes}`, {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
      })
    ]);
    
    const stock1Prices = Array.isArray(stock1Data.data) ? stock1Data.data : [stock1Data.data.stock];
    const stock2Prices = Array.isArray(stock2Data.data) ? stock2Data.data : [stock2Data.data.stock];
    
    // Align timestamps and calculate correlation
    // (Implementation of the correlation formula goes here)
    
    res.json({
      correlation: calculatedCorrelation,
      stocks: {
        [ticker1]: {
          averagePrice: stock1Average,
          priceHistory: stock1Prices
        },
        [ticker2]: {
          averagePrice: stock2Average,
          priceHistory: stock2Prices
        }
      }
    });
  } catch (error) {
    console.error('Error calculating correlation:', error);
    res.status(500).json({ error: 'Failed to calculate correlation' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});