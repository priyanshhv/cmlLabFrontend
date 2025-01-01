import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton
} from '@mui/material';
import Slider from 'react-slick';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const TeamSection = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axiosInstance.get(`${API_BASE_URL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamData();
  }, []);

  // Slick Slider Settings for an extra smooth transition
  const settings = {
    dots: true,
    infinite: true,
    speed: 1200,            // Slower speed (ms) = smoother transition
    cssEase: 'ease-in-out', // A smooth easing function
    slidesToShow: 3,        // Number of cards to display at once
    slidesToScroll: 1,      // Scroll 1 card each time
    autoplay: true,
    autoplaySpeed: 1000,    // Time each slide stays before auto-swiping
    arrows: true,           // Show left/right arrows
    responsive: [
      {
        // For tablet screens
        breakpoint: 960,
        settings: {
          slidesToShow: 2
        },
      },
      {
        // For mobile screens
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        },
      },
    ],
  };

  return (
    <Box sx={{ py: 5, px: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Our Team
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={12} key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={120} height={120} />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Skeleton variant="text" width={100} height={24} />
                <Skeleton variant="text" width={80} height={20} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            maxWidth: '80%',
            margin: '0 auto'
          }}
        >
          <Slider {...settings}>
            {users.map((user) => (
              <Box key={user._id} sx={{ p: 1 }}>
                <Card
                  sx={{
                    borderRadius: '1rem', // Rounded corners
                    // eBay-like gradient background
                    background:
                      'linear-gradient(45deg, #e53238 0%, #f5af02 25%, #86b817 50%, #0064d2 75%)',
                    color: '#fff',
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* White strip (or box) at the top for the avatar */}
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      pt: 3,
                      pb: 1,
                    }}
                  >
                    <Avatar
                    component={Link} 
                     to={`/users/${user._id}`}
                      sx={{ width: 120, height: 120 }}
                      src={`${API_BASE_URL}/${user.image || 'default-avatar.jpg'}`}
                      alt={user.name}
                    />
                  </Box>

                  {/* Card Content in white to keep text readable */}
                  <CardContent
                    sx={{
                      backgroundColor: '#fff',
                      color: '#333',
                      textAlign: 'center',
                      pt: 0,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      <strong>{user.name}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Role:</strong> {user.role || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Email:</strong> {user.email || 'Not Provided'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Bio:</strong> {user.bio || 'No bio available.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Box>
  );
};

export default TeamSection;
