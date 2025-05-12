import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { TextField, MenuItem, Box, Typography, Paper } from '@mui/material';
import { getStockData } from '../api';

const StockPage = () => {
  const [ticker, setTicker] = useState('NVDA');
  const [minutes, setMinutes] = useState(60);
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getStockData(ticker, minutes);
        setStockData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, minutes]);

  const chartData = {
    labels: stockData?.priceHistory.map(item => new Date(item.lastUpdatedAt).toLocaleTimeString()) || [],
    datasets: [
      {
        label: 'Stock Price',
        data: stockData?.priceHistory.map(item => item.price) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Average Price',
        data: stockData?.priceHistory.map(() => stockData?.averageStockPrice) || [],
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
      },
    ],
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Analysis
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          variant="outlined"
        />
        <TextField
          select
          label="Time Frame (minutes)"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          variant="outlined"
        >
          {[15, 30, 60, 120, 240, 1440].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      
      {stockData && (
        <>
          <Typography variant="h6" gutterBottom>
            Average Price: {stockData.averageStockPrice.toFixed(2)}
          </Typography>
          <Box sx={{ height: '400px' }}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || 0;
                        return `${label}: ${value.toFixed(2)}`;
                      },
                    },
                  },
                },
              }}
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default StockPage;