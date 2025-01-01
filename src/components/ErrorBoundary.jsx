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
                <Box sx={{ textAlign: 'center', py: 5 }}>
                    <Typography variant="h4" color="error">
                        Something went wrong.
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please try refreshing the page.
                    </Typography>
                    <Button variant="contained" onClick={this.handleReload}>
                        Refresh Page
                    </Button>
                </Box>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
