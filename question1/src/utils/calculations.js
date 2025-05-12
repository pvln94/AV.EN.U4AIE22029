// src/utils/calculations.js

/**
 * Calculate the average of an array of numbers
 * @param {number[]} prices - Array of stock prices
 * @returns {number} - Average price
 */
const calculateAverage = (prices) => {
  if (!prices.length) return 0;
  const sum = prices.reduce((acc, price) => acc + price, 0);
  return sum / prices.length;
};

/**
 * Calculate Pearson's correlation coefficient
 * @param {number[]} x - Prices of first stock
 * @param {number[]} y - Prices of second stock
 * @returns {number} - Correlation coefficient
 */
const calculateCorrelation = (x, y) => {
  if (x.length !== y.length || x.length < 2) return 0;

  const n = x.length;
  const meanX = calculateAverage(x);
  const meanY = calculateAverage(y);

  let cov = 0;
  let stdX = 0;
  let stdY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = x[i] - meanX;
    const diffY = y[i] - meanY;
    cov += diffX * diffY;
    stdX += diffX * diffX;
    stdY += diffY * diffY;
  }

  cov /= n - 1;
  stdX = Math.sqrt(stdX / (n - 1));
  stdY = Math.sqrt(stdY / (n - 1));

  if (stdX === 0 || stdY === 0) return 0;
  return cov / (stdX * stdY);
};

/**
 * Align price histories by minute
 * @param {Object[]} pricesX - Price history of first stock
 * @param {Object[]} pricesY - Price history of second stock
 * @returns {Object} - Aligned price arrays
 */
const alignPriceHistories = (pricesX, pricesY) => {
  const alignedX = [];
  const alignedY = [];

  const mapPricesByMinute = (prices) => {
    const minuteMap = new Map();
    prices.forEach(({ price, lastUpdatedAt }) => {
      const date = new Date(lastUpdatedAt);
      const minuteKey = `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()} ${date.getUTCHours()}:${date.getUTCMinutes()}`;
      if (!minuteMap.has(minuteKey) || new Date(minuteMap.get(minuteKey).lastUpdatedAt) < date) {
        minuteMap.set(minuteKey, { price, lastUpdatedAt });
      }
    });
    return minuteMap;
  };

  const mapX = mapPricesByMinute(pricesX);
  const mapY = mapPricesByMinute(pricesY);

  const allMinutes = new Set([...mapX.keys(), ...mapY.keys()]);

  for (const minute of allMinutes) {
    if (mapX.has(minute) && mapY.has(minute)) {
      alignedX.push(mapX.get(minute).price);
      alignedY.push(mapY.get(minute).price);
    }
  }

  return { alignedX, alignedY };
};

module.exports = { calculateAverage, calculateCorrelation, alignPriceHistories };