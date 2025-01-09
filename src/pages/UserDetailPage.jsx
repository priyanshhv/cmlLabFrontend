
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Divider,
  Stack,
  Link,
} from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  Link as LinkIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  YouTube as YouTubeIcon,
  X as XIcon,
} from '@mui/icons-material';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const UserDetailPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/api/team/${id}`);
        setUser(response.data.teamMember);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <LinearProgress />;
  if (!user) return <Typography sx={{ mt: 4, textAlign: 'center' }}>User not found.</Typography>;

  const getSocialIcon = (linkType) => {
    const iconProps = { sx: { fontSize: 24 } };
    switch (linkType.toLowerCase()) {
      case 'website': return <LinkIcon {...iconProps} />;
      case 'facebook': return <FacebookIcon {...iconProps} />;
      case 'instagram': return <InstagramIcon {...iconProps} />;
      case 'linkedin': return <LinkedInIcon {...iconProps} />;
      case 'github': return <GitHubIcon {...iconProps} />;
      case 'youtube': return <YouTubeIcon {...iconProps} />;
      case 'x': return <XIcon {...iconProps} />;
      default: return <LinkIcon {...iconProps} />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 5 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          overflow: 'visible',
          position: 'relative',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
            color: 'white',
            borderRadius: '8px 8px 0 0',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              }}
              src={`${user.image}`}
              alt={user.name}
            />
            <Box>
              <Typography variant="h4" sx={{ opacity: 0.9,fontWeight: 700 ,color: "white"}}>
                {user.name}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 ,color: "white"}}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Contact & Bio Section */}
          <Stack spacing={2} sx={{ mb: 4 }}>
            <Typography variant="body1">
              <strong>Email:</strong> {user.email}
            </Typography>
            {user.address && (
              <Typography variant="body1">
                <strong>Address:</strong> {user.address}
              </Typography>
            )}
            {user.bio && (
              <Typography variant="body1">
                <strong>Bio:</strong> {user.bio}
              </Typography>
            )}
          </Stack>


          {/* Education Timeline */}
          {user.education && user.education.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Education
              </Typography>
              <Timeline position="alternate">
                {user.education.map((edu) => (
                  <TimelineItem key={edu._id}>
                    <TimelineOppositeContent sx={{ m: 'auto 0' }} variant="body2" color="text.secondary">
                      {formatDate(edu.startDate)} - {edu.endDate ? formatDate(edu.endDate) : 'Present'}
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineConnector />
                      <TimelineDot color="primary">
                        <SchoolIcon />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent sx={{ py: '12px', px: 2 }}>
                      <Typography variant="h6" component="span">
                        {edu.degree}
                      </Typography>
                      <Typography>{edu.institution}</Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </>
          )}

          {/* Experience Timeline */}
          {user.experience && user.experience.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Experience
              </Typography>
              <Timeline position="alternate">
                {user.experience.map((exp) => (
                  <TimelineItem key={exp._id}>
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
                {/* Social Links */}
                {user.links && user.links.length > 0 && (
                  <>
                    <Divider sx={{ my: 3 }} />
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Connect with {user.name}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {user.links.map((link) => (
                          <IconButton
                            key={link._id}
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              color: 'primary.main',
                              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.04)' },
                            }}
                          >
                            {getSocialIcon(link.linkType)}
                          </IconButton>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailPage;