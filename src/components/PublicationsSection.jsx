

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Link as MuiLink,
  Skeleton
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const PublicationsSection = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to truncate summary to 80 words
  const truncateSummary = (summary) => {
    const words = summary.split(' ');
    if (words.length <= 80) return summary;
    return words.slice(0, 80).join(' ');
  };

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}/api/publications`);

        const publicationsWithAuthors = await Promise.all(
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

        setPublications(publicationsWithAuthors);
      } catch (error) {
        console.error('Failed to fetch publications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

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

  return (
    <Box sx={{ py: 5, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Recent Publications
      </Typography>

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Skeleton variant="rectangular" width="100%" height={200} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            width: { xs: '90%', sm: '80%', md: '60%' },
            margin: '0 auto'
          }}
        >
          <Carousel
            autoPlay
            interval={5000}
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible
            fullHeightHover={false}
            animation="slide"
            duration={1200}
          >
            {publications.map((pub) => (
              <Card key={pub._id}>
                <CardMedia
                  component="img"
                  sx={{
                    maxHeight: 400,
                    objectFit: 'cover',
                    width: '100%'
                  }}
                  image={`${API_BASE_URL}/${pub.coverImage}`}
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
};

export default PublicationsSection;