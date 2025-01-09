import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Skeleton,
  Link as MuiLink,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

// Helper function to truncate summary to 80 words
const truncateSummary = (summary) => {
  const words = summary.split(' ');
  if (words.length <= 60) return summary;
  return words.slice(0, 60).join(' ');
};

function renderAuthors(registeredAuthors = [], unregisteredAuthors = []) {
  const registeredEls = registeredAuthors.map((author, idx) => (
    <React.Fragment key={author.userId}>
      {idx > 0 && ', '}
      <MuiLink
        component={Link}
        to={`/users/${author.userId}`}
        underline="hover"
        sx={{ color: 'inherit', fontWeight: 'bold' }}
      >
        {author.name}
      </MuiLink>
    </React.Fragment>
  ));

  const unregisteredEls = unregisteredAuthors.map((authorName, idx) => {
    const shouldAddComma = registeredAuthors.length > 0 || idx > 0;
    return (
      <React.Fragment key={`unreg-${idx}`}>
        {shouldAddComma && ', '}
        {authorName}
      </React.Fragment>
    );
  });

  return [...registeredEls, ...unregisteredEls];
}

export default function PublicationsSection() {
  const [selectedYear, setSelectedYear] = useState(dayjs());
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicationsByYear = async () => {
      try {
        setLoading(true);
        const yearNum = selectedYear.year();
        const res = await axiosInstance.get(
          `${API_BASE_URL}/api/publications/year/${yearNum}`
        );

        const pubsWithAuthors = await Promise.all(
          res.data.map(async (pub) => {
            const pubAuthors = Array.isArray(pub.authors) ? pub.authors : [];
            const pubAdditional = Array.isArray(pub.additionalAuthors)
              ? pub.additionalAuthors
              : [];

            const registeredAuthorsDetails = await Promise.all(
              pubAuthors.map(async (authorId) => {
                const authorRes = await axiosInstance.get(
                  `${API_BASE_URL}/api/team/${authorId}`
                );
                return {
                  userId: authorId,
                  name: authorRes.data.teamMember.name
                };
              })
            );

            return {
              ...pub,
              registeredAuthors: registeredAuthorsDetails,
              unregisteredAuthors: pubAdditional
            };
          })
        );

        setPublications(pubsWithAuthors);
      } catch (error) {
        console.error('Failed to fetch publications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicationsByYear();
  }, [selectedYear]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        py: 5,
        background: 'linear-gradient(135deg, #c0c0ff 0%, #e1e0fa 50%, #fefefe 100%)'
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}
      >
        Publications by Year
      </Typography>

      {/* Year Picker */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Select Year"
            views={['year']}
            value={selectedYear}
            onChange={(newValue) => {
              setSelectedYear(newValue);
            }}
            renderInput={(params) => (
              <params.TextField
                {...params}
                sx={{
                  width: 200,
                  '& .MuiInputBase-input': {
                    fontSize: '1.25rem',
                    fontWeight: 'bold'
                  }
                }}
              />
            )}
          />
        </LocalizationProvider>
      </Box>

      {/* Loading / No Publications Fallback */}
      {loading ? (
        <Grid container spacing={3} sx={{ px: 3 }}>
          {Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Skeleton variant="rectangular" width="100%" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : publications.length === 0 ? (
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{ textAlign: 'center', mt: 3 }}
        >
          No publications found for {selectedYear.year()}.
        </Typography>
      ) : (
        <Box
          sx={{
            width: { xs: '90%', sm: '80%', md: '60%' },
            margin: '0 auto'
          }}
        >
          <Carousel
            autoPlay
            interval={6000}
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible
            fullHeightHover={false}
            animation="slide"
            duration={1900}
          >
            {publications.map((pub) => (
              <Card key={pub._id}>
                <CardMedia
                  component="img"
                  sx={{
                    // If you prefer to see the whole image, use 'contain'. 
                    // If you want it to fill the area, use 'cover'. 
                    objectFit: 'contain', 
                    height: 400,
                    transition: 'transform 0.2s ease',
                    backgroundColor: '#f7f7f7', // subtle background behind 'contain'
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  image={pub.coverImage}
                  alt={pub.title}
                  onError={(e) => {
                    e.target.src = '/default-cover.jpg';
                  }}
                />
                <CardContent>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    {pub.title}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {truncateSummary(pub.summary)}
                    {pub.summary.split(' ').length > 80 && pub.doi && (
                      <MuiLink
                        href={pub.doi}
                        sx={{
                          ml: 1,
                          textAlign: 'justify',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'none'
                          }
                        }}
                      >
                        read more
                      </MuiLink>
                    )}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    <strong>Authors: </strong>
                    {renderAuthors(pub.registeredAuthors, pub.unregisteredAuthors)}
                  </Typography>

                  {pub.doi && (
                    <MuiLink
                      href={pub.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                    >
                      Read Full Article
                    </MuiLink>
                  )}
                </CardContent>
              </Card>
            ))}
          </Carousel>
        </Box>
      )}
    </Box>
  );
}
