import React from 'react'; 
import { Box, Typography, Button } from '@mui/material';
import heroImage from '../assets/hero-bg.jpg'; // your hero background image

const HeroSection = () => {
  // Smooth-scroll to the contact form
  const handleContactClick = () => {
    const contactEl = document.getElementById('contact-section');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        color: '#fff',
      }}
    >
      {/* Overlay to darken the background for better text contrast */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Adjust if you need more or less darkening
        }}
      />

      <Box
        sx={{
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '600px',
          px: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800, // Make text bolder
            mb: 2,
            color: '#fff',   // Ensure the text is white
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.6)',
          }}
        >
          Welcome to Our Structural Engineering Lab
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: 4,
            fontWeight: 700,  // Slightly bolder subtitle
            color: '#fff',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.6)',
          }}
        >
          Pushing the boundaries of research, innovation, and technology.
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#f50057',
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#c51162',
            },
          }}
          onClick={handleContactClick}
        >
          Contact Us
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
