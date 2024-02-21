import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './components/App.jsx';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deepPurple, amber } from '@mui/material/colors';

import { Box } from '@mui/material';

// create a theme using the DeepPurple & Amber palette
// const theme = createTheme({
//   palette: {
//     primary: deepPurple,
//     secondary: amber,
//   },
  
//   });

const theme = createTheme({
  palette: {
    primary: {
      main: '#673AB7', // DeepPurple
    },
    secondary: {
      main: '#FFC107', // amber 
    },
  },
  background: {
    default: '#F5F5F5', // custom Beige 
  },
});



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}> 
      <Box sx={{ backgroundColor: theme.background.default, minHeight: '100vh' }}>
        <App />
      </Box>
    </ThemeProvider>
  </React.StrictMode>
);