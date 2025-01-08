
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'relative',
        py: 5,
        px: { xs: 2, md: 5 },
        background: 'linear-gradient(135deg, #e0f7fa 0%, #fff 100%)',
      }}
    >
      {/* About Section */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          About Us
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto' }}>
          {aboutContent.text}
        </Typography>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Admin Section */}
      {admin && (
        <Paper
          elevation={3}
          sx={{
            p: 3,
            maxWidth: '1000px',
            mx: 'auto',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            gap: 4,
            mb: 4
          }}>
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
                src={`${API_BASE_URL}/${admin.image}`}
                alt={admin.name}
                sx={{
                  width: 150,
                  height: 150,
                  border: '3px solid #fff',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                }}
              />
              <Typography variant="h6">{admin.name}</Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {admin.role}
              </Typography>
            </Box>

            {/* Experience Timeline */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2, textAlign: { xs: 'center', md: 'left' } }}>
                Experience
              </Typography>
              {admin.experience && admin.experience.length > 0 && (
                <Timeline position="alternate">
                  {admin.experience.map((exp, index) => (
                    <TimelineItem key={index}>
                      <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                        {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineConnector />
                        <TimelineDot color="secondary">
                          <WorkIcon />
                        </TimelineDot>
                        <TimelineConnector />
                      </TimelineSeparator>
                      <TimelineContent sx={{ py: '12px', px: 2 }}>
                        <Typography variant="h6" component="span">
                          {exp.degree}
                        </Typography>
                        <Typography>{exp.institution}</Typography>
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
        <path
          fill="#ffffff"
          d="M0,256L40,245.3C80,235,160,213,240,186.7C320,160,400,128,480,112C560,96,640,96,720,106.7C800,117,880,139,960,149.3C1040,160,1120,160,1200,165.3C1280,171,1360,181,1400,186.7L1440,192L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        />
      </Box>
    </Box>
  );
};

export default AboutSection;