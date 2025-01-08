import React from 'react';
import { Box, Typography, Button } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary Caught:', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

     render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            px: 2,
            backgroundColor: 'background.paper', // unify with theme
            color: 'text.primary',
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: 'error.main', mb: 2 }}
          >
            Something went wrong.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please try refreshing the page or come back later.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleReload}
            sx={{ fontWeight: 600 }}
          >
            Refresh Page
          </Button>
        </Box>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
