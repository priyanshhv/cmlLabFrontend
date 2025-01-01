
// // export default HeroSection;

// import React from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import heroImage from '../assets/hero-bg.jpg'; // your hero background image

// const HeroSection = () => {
//   return (
//     <Box
//       sx={{
//         height: '80vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundImage: `url(${heroImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         position: 'relative',
//         color: '#fff',
//       }}
//     >
//       {/* Optional overlay to darken the background for better text contrast */}
//       <Box
//         sx={{
//           position: 'absolute',
//           inset: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//         }}
//       />
//       <Box
//         sx={{
//           zIndex: 1,
//           textAlign: 'center',
//           maxWidth: '600px',
//           px: 2,
//         }}
//       >
//         <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
//           Welcome to Our Structural Engineering Lab
//         </Typography>
//         <Typography variant="h6" sx={{ mb: 4 }}>
//           Pushing the boundaries of research, innovation, and technology.
//         </Typography>
//         <Button variant="contained" size="large" sx={{ backgroundColor: '#f50057' }}>
//           Learn More
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default HeroSection;

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import heroImage from '../assets/hero-bg.jpg'; // your hero background image

const HeroSection = () => {
  // Scroll to contact form
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
      {/* Optional overlay to darken the background for better text contrast */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
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
        <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
          Welcome to Our Structural Engineering Lab
        </Typography>
        <Typography variant="h6" sx={{ mb: 4 }}>
          Pushing the boundaries of research, innovation, and technology.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ backgroundColor: '#f50057' }}
          onClick={handleContactClick}
        >
          Contact Us
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
