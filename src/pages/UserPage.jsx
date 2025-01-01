

// ./pages/UserPage;

import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  Box
} from '@mui/material';
import Grid from '@mui/material/Grid'; // We’ll use for Skeleton layout, not for final display
import Slider from 'react-slick';
import { useSnackbar } from 'notistack';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // Track team members
  const [loading, setLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsersAndTeamMembers = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch all users
        const usersRes = await axiosInstance.get(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);

        // Fetch team members
        const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Extract the user IDs from the team members
        setTeamMembers(teamRes.data.map((member) => member.userId));
      } catch (error) {
        enqueueSnackbar('Failed to fetch users or team members', {
          variant: 'error'
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersAndTeamMembers();
  }, [enqueueSnackbar]);

  const addToTeam = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(
        `${API_BASE_URL}/api/team`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      enqueueSnackbar('User added to team successfully!', { variant: 'success' });
      setTeamMembers((prev) => [...prev, userId]); // Update team member list
    } catch (error) {
      enqueueSnackbar('Failed to add user to team', { variant: 'error' });
      console.error(error);
    }
  };

  const removeFromTeam = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`${API_BASE_URL}/api/team/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      enqueueSnackbar('User removed from team successfully!', {
        variant: 'success'
      });
      // Filter out the removed user's ID
      setTeamMembers((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      enqueueSnackbar('Failed to remove user from team', { variant: 'error' });
      console.error(error);
    }
  };

  // Slider Settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,            // Slide transition speed (ms)
    slidesToShow: 3,       // How many cards to show at once
    slidesToScroll: 1,     // How many cards to scroll each time
    autoplay: true, 
    autoplaySpeed: 4000,   // 4 seconds per slide
    arrows: true,          // Show left/right arrows
    responsive: [
      {
        breakpoint: 960, // <= 960px (tablet)
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600, // <= 600px (mobile)
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <Box sx={{ py: 5, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Users
      </Typography>

      {loading ? (
        // If loading, show some skeleton placeholders in a grid layout
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={250} />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Once loaded, use the Slider to show user cards
        <Box
          sx={{
            maxWidth: { xs: '100%', sm: '90%', md: '80%' },
            margin: '0 auto'
          }}
        >
          <Slider {...sliderSettings}>
            {users.map((user) => (
              <Box key={user._id} sx={{ p: 1 }}>
                <Card
                  sx={{
                    borderRadius: '1rem',
                    // eBay-like gradient
                    background:
                      'linear-gradient(45deg, #e53238 0%, #f5af02 25%, #86b817 50%, #0064d2 75%)',
                    color: '#fff',
                    overflow: 'hidden',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                  }}
                >
                  {/* White strip at the top for the avatar */}
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      pt: 3,
                      pb: 1
                    }}
                  >
                    <Avatar
                      sx={{ width: 120, height: 120 }}
                      src={`${API_BASE_URL}/${user.image || 'default-avatar.jpg'}`}
                      alt={user.name}
                    />
                  </Box>

                  {/* Card Content area in white for readability */}
                  <CardContent
                    sx={{
                      backgroundColor: '#fff',
                      color: '#333',
                      textAlign: 'center',
                      pt: 0
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {user.role || 'No role specified'}
                    </Typography>

                    {teamMembers.includes(user._id) ? (
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => removeFromTeam(user._id)}
                        sx={{ mt: 1 }}
                      >
                        Remove from Team
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addToTeam(user._id)}
                        sx={{ mt: 1 }}
                      >
                        Add to Team
                      </Button>
                    )}
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

export default UserPage;
