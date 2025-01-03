

// PublicationsSection.jsx

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
import { Link } from 'react-router-dom'; // For clickable user links
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const PublicationsSection = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}/api/publications`);

        // Transform each publication to retrieve:
        //   1) Registered authors (user objects with userId, name)
        //   2) Unregistered (additional) authors (plain strings)
        const publicationsWithAuthors = await Promise.all(
          res.data.map(async (pub) => {
            // Safely handle potentially undefined or null arrays
            const pubAuthors = Array.isArray(pub.authors) ? pub.authors : [];
            const pubAdditional = Array.isArray(pub.additionalAuthors)
              ? pub.additionalAuthors
              : [];

            // Fetch details for each registered author
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

            // Return a unified object including both author types
            return {
              ...pub,
              registeredAuthors: registeredAuthorsDetails, // array of { userId, name }
              unregisteredAuthors: pubAdditional           // array of strings
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

  // Helper function to safely render authors
  function renderAuthors(registeredAuthors = [], unregisteredAuthors = []) {
    // Convert registered authors to clickable links
    const registeredEls = registeredAuthors.map((author, idx) => (
      <React.Fragment key={author.userId}>
        {idx > 0 && ', '} {/* Add a comma if not the first registered author */}
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

    // Convert unregistered authors to plain text
    const unregisteredEls = unregisteredAuthors.map((authorName, idx) => {
      // Add a comma if there's already at least one registered author
      // or if this is not the first unregistered author
      const shouldAddComma = registeredAuthors.length > 0 || idx > 0;
      return (
        <React.Fragment key={`unreg-${idx}`}>
          {shouldAddComma && ', '}
          {authorName}
        </React.Fragment>
      );
    });

    // Combine both arrays into a single comma-separated list
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
        /* Center the carousel container and limit the width to ~60% */
        <Box
          sx={{
            width: { xs: '90%', sm: '80%', md: '60%' },
            margin: '0 auto'
          }}
        >
          <Carousel
            autoPlay
            interval={5000}         // 5 seconds per slide
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible // Show nav buttons at all times
            fullHeightHover={false}
            animation="slide"
            duration={1200}         // 1.2s transition for extra smoothness
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
                    e.target.src = '/default-cover.jpg'; // fallback image
                  }}
                />
                <CardContent>
                  <Typography variant="h6" textAlign="center" gutterBottom>
                    {pub.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    {pub.summary}
                  </Typography>

                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    <strong>Authors: </strong>
                    {renderAuthors(pub.registeredAuthors, pub.unregisteredAuthors)}
                  </Typography>

                  {/* If a DOI is present, show a link to the full article */}
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
