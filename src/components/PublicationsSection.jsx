import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Box,
  Link,
  Skeleton
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const PublicationsSection = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const res = await axiosInstance.get(`${API_BASE_URL}/api/publications`);
        const publicationsWithAuthors = await Promise.all(
          res.data.map(async (pub) => {
            const authors = await Promise.all(
              pub.authors.map(async (authorId) => {
                const authorRes = await axiosInstance.get(
                  `${API_BASE_URL}/api/team/${authorId}`
                );
                return authorRes.data.teamMember.name;
              })
            );
            return { ...pub, authorNames: authors };
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
            interval={5000}            // 5 seconds per slide
            indicators
            swipe
            cycleNavigation
            navButtonsAlwaysVisible    // Show nav buttons at all times
            fullHeightHover={false}
            animation="slide"          // or "fade"
            duration={1200}            // 1.2s transition for extra smoothness
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
                    e.target.src = '/default-cover.jpg'; // Fallback image
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
                    <strong>Authors:</strong> {pub.authorNames?.join(', ') || 'Unknown'}
                  </Typography>
                  <Link href={pub.doi} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </Link>
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
