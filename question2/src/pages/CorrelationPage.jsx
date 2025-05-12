import React, { useState, useEffect } from 'react';
import { Chart } from 'react-chartjs-2';
import { 
  TextField, 
  MenuItem, 
  Box, 
  Typography, 
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { getStockCorrelation } from '../api';
import 'chart.js/auto'; // Required for Chart.js v3+

const CorrelationPage = () => {
  const [minutes, setMinutes] = useState(60);
  const [correlationData, setCorrelationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample stock data - replace with your actual data source
  const stocks = ['NVDA', 'PYPL', 'AAPL', 'MSFT', 'GOOGL'];

  useEffect(() => {
    const fetchCorrelationData = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, you would call your API here:
        // const data = await getStockCorrelation(stocks, minutes);
        
        // Mock data for demonstration
        const mockData = {
          matrix: Array(stocks.length).fill().map(() => 
            Array(stocks.length).fill().map(() => (Math.random() * 2 - 1).toFixed(4))
          ,
          stocks)
        };
        
        setCorrelationData(mockData);
      } catch (err) {
        setError('Failed to load correlation data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrelationData();
  }, [minutes]);

  const chartData = {
    labels: stocks,
    datasets: [{
      label: 'Stock Correlation',
      data: correlationData?.matrix.flat(),
      backgroundColor: (context) => {
        const value = context.dataset.data[context.dataIndex];
        const opacity = Math.abs(value);
        return value < 0 
          ? `rgba(255, 99, 132, ${opacity})` 
          : `rgba(54, 162, 235, ${opacity})`;
      },
      borderColor: '#fff',
      borderWidth: 1,
      hoverBorderWidth: 2,
      width: (ctx) => ctx.chart.width / stocks.length - 1,
      height: (ctx) => ctx.chart.height / stocks.length - 1
    }]
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Stock Correlation Heatmap
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          select
          label="Time Frame"
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          variant="outlined"
          sx={{ minWidth: 200 }}
          disabled={loading}
        >
          {[15, 30, 60, 120, 240, 1440].map((value) => (
            <MenuItem key={value} value={value}>
              {value} minutes
            </MenuItem>
          ))}
        </TextField>
        
        {loading && <CircularProgress size={24} />}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {correlationData && (
        <Box sx={{ height: '500px', position: 'relative' }}>
          <Chart
            type="matrix"
            data={{
              ...chartData,
              xLabels: stocks,
              yLabels: stocks
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    title: () => '',
                    label: (context) => {
                      const xLabel = stocks[context.column];
                      const yLabel = stocks[context.row];
                      const value = context.dataset.data[context.dataIndex];
                      return `${xLabel} vs ${yLabel}: ${value}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  ticks: {
                    display: true
                  },
                  grid: {
                    display: false
                  }
                },
                y: {
                  offset: true,
                  ticks: {
                    display: true
                  },
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </Box>
      )}
    </Paper>
  );
};

export default CorrelationPage;