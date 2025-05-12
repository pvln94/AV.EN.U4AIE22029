// src/services/stockService.js
const axios = require('axios');
const { getAuthToken } = require('../config');
const { calculateAverage, calculateCorrelation, alignPriceHistories } = require('../utils/calculations');

const TEST_SERVER_URL = process.env.TEST_SERVER_URL;

/**
 * Fetch stock price history
 * @param {string} ticker - Stock ticker
 * @param {number} minutes - Time interval
 * @returns {Object[]} - Price history
 */
const fetchStockPrices = async (ticker, minutes) => {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${TEST_SERVER_URL}/stocks/${ticker}?minutes=${minutes}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return Array.isArray(response.data) ? response.data : [response.data.stock];
  } catch (error) {
    console.error(`Error fetching prices for ${ticker}:`, error.message);
    throw new Error(`Failed to fetch prices for ${ticker}`);
  }
};

/**
 * Get average stock price
 * @param {string} ticker - Stock ticker
 * @param {number} minutes - Time interval
 * @returns {Object} - Average price and history
 */
const getAverageStockPrice = async (ticker, minutes) => {
  const prices = await fetchStockPrices(ticker, minutes);
  const priceValues = prices.map((p) => p.price);
  const average = calculateAverage(priceValues);
  return {
    averageStockPrice: average,
    priceHistory: prices,
  };
};

/**
 * Get correlation between stocks
 * @param {string} ticker1 - First ticker
 * @param {string} ticker2 - Second ticker
 * @param {number} minutes - Time interval
 * @returns {Object} - Correlation and stock details
 */
const getStockCorrelation = async (ticker1, ticker2, minutes) => {
  const [prices1, prices2] = await Promise.all([
    fetchStockPrices(ticker1, minutes),
    fetchStockPrices(ticker2, minutes),
  ]);

  const { alignedX, alignedY } = alignPriceHistories(prices1, prices2);
  const correlation = calculateCorrelation(alignedX, alignedY);

  // Calculate standard deviation for each stock
  const calculateStdDev = (prices, mean) => {
    if (prices.length < 2) return 0;
    const variance = prices.reduce((acc, p) => acc + Math.pow(p - mean, 2), 0) / (prices.length - 1);
    return Math.sqrt(variance);
  };

  const avg1 = calculateAverage(prices1.map((p) => p.price));
  const avg2 = calculateAverage(prices2.map((p) => p.price));

  return {
    correlation: Number(correlation.toFixed(4)),
    stocks: {
      [ticker1]: {
        averagePrice: avg1,
        stdDev: calculateStdDev(prices1.map((p) => p.price), avg1),
        priceHistory: prices1,
      },
      [ticker2]: {
        averagePrice: avg2,
        stdDev: calculateStdDev(prices2.map((p) => p.price), avg2),
        priceHistory: prices2,
      },
    },
  };
};

module.exports = { getAverageStockPrice, getStockCorrelation };