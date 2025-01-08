// Footer.jsx

import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        py: 3,
        textAlign: 'center',
        backgroundColor: 'primary.main', // Use theme primary
        color: '#fff',
        mt: 4,
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.95rem' }}>
        © {new Date().getFullYear()} OurLab |{' '}
        <Link
          href="/privacy"
          sx={{
            color: '#fff',
            textDecoration: 'underline',
            '&:hover': { color: 'secondary.light' },
          }}
        >
          Privacy Policy
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;
