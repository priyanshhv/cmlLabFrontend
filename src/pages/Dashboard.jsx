// ./pages/Dashboard.jsx
import React from 'react';
import { Typography, Box, Grid } from '@mui/material';

const Dashboard = () => (
    <Box sx={{ py: 5, px: 3 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
            Dashboard
        </Typography>
        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Typography variant="body1">
                    Welcome to your dashboard. Here you can manage publications, view users, and more!
                </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
                {/* Example area for statistics or charts */}
                <Typography variant="body2" color="textSecondary">
                    Add additional dashboard features here (e.g., recent stats or charts).
                </Typography>
            </Grid>
        </Grid>
    </Box>
);

export default Dashboard;
