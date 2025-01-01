import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const NotFound = () => (
    <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h4" color="error">
            404 - Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
            The page you’re looking for doesn’t exist.
        </Typography>
        <Button variant="contained" href="/">
            Go to Home
        </Button>
    </Box>
);

export default NotFound;
