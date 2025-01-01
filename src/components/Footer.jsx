import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: 'center',
        backgroundColor: '#3f51b5',
        color: '#fff',
        mt: 4,
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} OurLab | 
        <Link href="/privacy" sx={{ color: '#fff', ml: 1 }}>
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
