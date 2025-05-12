import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getStockData = async (ticker, minutes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks/${ticker}?minutes=${minutes}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
};

export const getStockCorrelation = async (ticker1, ticker2, minutes) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stockcorrelation?minutes=${minutes}&ticker=${ticker1}&ticker=${ticker2}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching correlation data:', error);
    throw error;
  }
};

export const getAllStocks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stocks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all stocks:', error);
    throw error;
  }
};