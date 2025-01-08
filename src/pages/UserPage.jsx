
import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Typography,
  Avatar,
  Skeleton,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Slider from 'react-slick';
import { useSnackbar } from 'notistack';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]); // Track team members
  const [alumniStatus, setAlumniStatus] = useState({}); // Track alumni status
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

        // Fetch team members and their alumni status
        const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTeamMembers(teamRes.data.map((member) => member.userId));
        const alumniStatusMap = teamRes.data.reduce((acc, member) => {
          acc[member.userId] = member.isAlumni || false;
          return acc;
        }, {});
        setAlumniStatus(alumniStatusMap);
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
      setTeamMembers((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      enqueueSnackbar('Failed to remove user from team', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleAlumniStatus = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !alumniStatus[userId]; // Toggle status for the specific user
      await axiosInstance.patch(
        `${API_BASE_URL}/api/team/${userId}/alumni`,
        { isAlumni: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAlumniStatus((prev) => ({ ...prev, [userId]: newStatus })); // Only update the status for the user
      enqueueSnackbar(
        `User marked as ${newStatus ? 'Alumni' : 'Active Team Member'}`,
        { variant: 'success' }
      );
    } catch (error) {
      enqueueSnackbar('Failed to update alumni status', { variant: 'error' });
      console.error(error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
   <Box sx={{ py: 6, px: { xs: 2, md: 4 }, backgroundColor: 'background.default' }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
        Users
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={12} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={250} />
            </Grid>
          ))}
        </Grid>
      ) : (
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
                    // Instead of a custom gradient, rely on MUI Paper background:
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    // Keep the hover effect subtle (or rely on the global .MuiCard override):
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3, pb: 1 }}>
                    <Avatar
                      sx={{ width: 120, height: 120 }}
                      src={`${user.image}`}
                      alt={user.name}
                    />
                  </Box>
                  <CardContent sx={{ textAlign: 'center', pt: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {user.role || 'No role specified'}
                    </Typography>
                    {teamMembers.includes(user._id) ? (
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => removeFromTeam(user._id)}
                          sx={{ mt: 1,mr:1 }}
                        >
                          Remove from Team
                        </Button>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={alumniStatus[user._id] || false}
                              onChange={() => toggleAlumniStatus(user._id)}
                              color="primary"
                            />
                          }
                          label="Alumni"
                          sx={{ mt: 1 }}
                        />
                      </>
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
