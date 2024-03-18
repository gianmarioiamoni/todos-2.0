import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App.jsx';

import { ThemeProvider } from '@mui/material/styles';

import { Box } from '@mui/material';

import { theme } from "./common/themes.jsx"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Box sx={{ backgroundColor: theme.background.default, minHeight: '100vh' }}>
          <App />
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
