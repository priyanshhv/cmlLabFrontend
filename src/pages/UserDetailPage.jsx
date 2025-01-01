// ./pages/UserDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  Paper,
  Grid,
} from '@mui/material';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const UserDetailPage = () => {
  const { id } = useParams(); // e.g. /users/:id
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get(`${API_BASE_URL}/api/team/${id}`,
        );
        setUser(response.data.teamMember);
        
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return <LinearProgress />;
  }

  if (!user) {
    return <Typography sx={{ mt: 4, textAlign: 'center' }}>User not found.</Typography>;
  }

  const {
    name,
    email,
    address,
    role,
    bio,
    image,
    timeline,
  } = user;

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 5 } }}>
      <Card
        sx={{
          maxWidth: 800,
          mx: 'auto',
          overflow: 'visible',
          position: 'relative',
          p: 2,
        }}
      >
        {/* Top Section: Avatar & Basic Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{ width: 120, height: 120 }}
            src={`${API_BASE_URL}/${image || 'default-avatar.jpg'}`}
            alt={name}
          />
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
              {role} 
            </Typography>
          </Box>
        </Box>

        <CardContent>
          {/* Bio & Contact Info */}
          <Typography variant="body1" sx={{ mt: 2 }}>
            <strong>Email:</strong> {email}
          </Typography>
          {address && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Address:</strong> {address}
            </Typography>
          )}
          {bio && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              <strong>Bio:</strong> {bio}
            </Typography>
          )}

          {/* Timeline Section */}
          {timeline && timeline.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Education / Career Timeline
              </Typography>
              {timeline.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                        {item.startDate
                          ? new Date(item.startDate).toLocaleDateString()
                          : 'N/A'}{' '}
                        -{' '}
                        {item.endDate
                          ? new Date(item.endDate).toLocaleDateString()
                          : 'Present'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography variant="body1">
                        <strong>Institution:</strong> {item.institution}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Degree:</strong> {item.degree}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailPage;
