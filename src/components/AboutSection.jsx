
import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Avatar, Divider, CircularProgress } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import { Work as WorkIcon } from '@mui/icons-material';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  const [aboutContent, setAboutContent] = useState('');
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch about content
        const aboutResponse = await axiosInstance.get(`${API_BASE_URL}/api/about`);
        setAboutContent(aboutResponse.data[0]);

        // Fetch first admin
        const adminsResponse = await axiosInstance.get(`${API_BASE_URL}/api/admins`);
        if (adminsResponse.data.length > 0) {
          setAdmin(adminsResponse.data[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

   return loading ? (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
      <CircularProgress />
    </Box>
  ) : (
    <Box
      sx={{
        position: 'relative',
        py: 6,                    // Increased padding for breathing room
        px: { xs: 2, md: 6 },     // Slightly bigger horizontal padding
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
      }}
    >
      {/* About Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h3"             // Slightly larger heading
          sx={{
            mb: 2,
            fontWeight: 700,
            color: 'primary.main', // Use your theme's primary color for emphasis
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="body1"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            fontSize: '1rem',      // Ensure consistent body text
            color: 'text.primary',
            lineHeight: 1.6,
             textAlign: 'justify',
          }}
        >
          {aboutContent.text}
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Admin Section */}
      {admin && (
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            maxWidth: '1000px',
            mx: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              gap: 4,
              mb: 4,
            }}
          >
            {/* Admin Picture and Info */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Avatar
                component={Link}
                to={`/users/${admin._id}`}
                src={`${admin.image}`}
                alt={admin.name}
                sx={{
                  width: 150,
                  height: 150,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {admin.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {admin.role}
              </Typography>
            </Box>

            {/* Experience Timeline */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  textAlign: { xs: 'center', md: 'left' },
                  fontWeight: 700,
                }}
              >
                Experience
              </Typography>
              {admin.experience && admin.experience.length > 0 && (
                <Timeline position="alternate">
                  {admin.experience.map((exp, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent
                        sx={{
                          m: 'auto 0',
                          color: 'text.secondary',
                          fontSize: '0.9rem',
                        }}
                      >
                        {formatDate(exp.startDate)} -{' '}
                        {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="secondary">
                          <WorkIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, mb: 0.5 }}
                        >
                          {exp.degree}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {exp.institution}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Wave SVG */}
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
      </Box>
    </Box>
  );
};

export default AboutSection;