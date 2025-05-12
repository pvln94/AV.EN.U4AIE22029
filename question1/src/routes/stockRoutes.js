// src/routes/stockRoutes.js
const express = require('express');
const { getAverageStockPrice, getStockCorrelation } = require('../services/stockService');

const router = express.Router();

/**
 * @route GET /stocks/:ticker
 * @desc Get average stock price
 */
router.get('/stocks/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const { minutes, aggregation } = req.query;

  if (aggregation !== 'average') {
    return res.status(400).json({ error: 'Invalid aggregation type' });
  }

  if (!minutes || isNaN(minutes)) {
    return res.status(400).json({ error: 'Invalid minutes parameter' });
  }

  try {
    const result = await getAverageStockPrice(ticker, Number(minutes));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /stockcorrelation
 * @desc Get correlation between two stocks
 */
router.get('/stockcorrelation', async (req, res) => {
  const { minutes, ticker } = req.query;

  if (!minutes || isNaN(minutes)) {
    return res.status(400).json({ error: 'Invalid minutes parameter' });
  }

  if (!ticker || !Array.isArray(ticker) || ticker.length !== 2) {
    return res.status(400).json({ error: 'Exactly two tickers are required' });
  }

  const [ticker1, ticker2] = ticker;

  try {
    const result = await getStockCorrelation(ticker1, ticker2, Number(minutes));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;