import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Container, CssBaseline, Typography } from '@mui/material';
import StockPage from './pages/StockPage';
import CorrelationPage from './pages/CorrelationPage';

function App() {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit', marginRight: '20px' }}>
            <Typography variant="h6">Stock Analysis</Typography>
          </Link>
          <Link to="/correlation" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6">Correlation</Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlation" element={<CorrelationPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;