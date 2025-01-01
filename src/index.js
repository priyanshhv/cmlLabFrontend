//indes.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack'; // For notifications
import store from './redux/store';
import App from './App';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
 
   
  components: {
    // You can override MUI component styles here
    // e.g. Buttons, AppBar, etc
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // make all buttons slightly curved
          textTransform: 'none', // keep normal text (not uppercase)
        },
      },
    },
  },
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <React.StrictMode>
                    <ErrorBoundary>
                    <App />
                    </ErrorBoundary>
                </React.StrictMode>
            </SnackbarProvider>
        </ThemeProvider>
    </Provider>
);
