// AboutSection.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const AboutSection = () => (
    
    // <Box
    //     sx={{
    //         py: 5,
    //         px: { xs: 2, md: 5 },
    //         backgroundColor: '#e0f7fa',
            
    //     }}
    // >
    //     <Typography variant="h4" sx={{ mb: 2 }}>
    //         About Us
    //     </Typography>
    //     <Typography variant="body1">
    //         Our lab is dedicated to pushing the boundaries of research and innovation in structural engineering.
    //         We focus on collaborative research projects, cutting-edge technology, and mentoring the next generation
    //         of researchers.
    //     </Typography>
    // </Box>
    <Box
  sx={{
    position: 'relative',
    py: 5,
    px: { xs: 2, md: 5 },
    background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
    textAlign:"center"
  }}
>
  <Typography variant="h4" sx={{ mb: 2 }}>
    About Us
  </Typography>
  {/* content */}
   <Typography variant="body1">
            Our lab is dedicated to pushing the boundaries of research and innovation in structural engineering.
            We focus on collaborative research projects, cutting-edge technology, and mentoring the next generation
            of researchers.
        </Typography>
  <Box
    component="svg"
    sx={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '50px',
    }}
    viewBox="0 0 1440 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#ffffff"
      d="M0,256L40,245.3C80,235,160,213,240,186.7C320,160,400,128,480,112C560,96,640,96,720,106.7C800,117,880,139,960,149.3C1040,160,1120,160,1200,165.3C1280,171,1360,181,1400,186.7L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
    />
  </Box>
</Box>

);

export default AboutSection;
