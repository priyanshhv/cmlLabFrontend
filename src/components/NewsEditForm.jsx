// src/components/NewsEditForm.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  LinearProgress,
} from '@mui/material';
import MDEditor from '@uiw/react-md-editor'; // For markdown editing
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const NewsEditForm = () => {
  // Get ID from URL and navigate function from React Router
  const { id } = useParams();
  const navigate = useNavigate();

  // State for form fields
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');

  // State for loading and errors
  const [loading, setLoading] = useState(true); // Start loading true to fetch data
  const [submitting, setSubmitting] = useState(false); // For submission state
  const [error, setError] = useState(null);

  // Fetch existing news data when the component loads
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/api/news/${id}`);
        setTitle(response.data.title);
        setParagraph(response.data.paragraph);
      } catch (err) {
        console.error('Failed to fetch news data:', err);
        setError('Could not load news article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [id]); // Rerun if the ID changes

  // Handle form submission to update the news
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to edit news.');
      setSubmitting(false);
      return;
    }

    try {
      await axiosInstance.patch(
        `${API_BASE_URL}/api/news/${id}`,
        { title, paragraph }, // Only send title and paragraph
        {
          headers: {
            Authorization: `Bearer ${token}`, // Authorization header
          },
        }
      );

      alert('News updated successfully!');
      navigate(`/news/${id}`); // Redirect back to the detail page on success
    } catch (err) {
      console.error('Error updating news:', err);
      setError('Failed to update news. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Display a loading indicator while fetching initial data
  if (loading) {
    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>Loading Editor...</Typography>
            <LinearProgress />
        </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 4 }, mt: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          Edit News
        </Typography>

        {/* Display general error messages */}
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        {/* Title Field */}
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          sx={{ mb: 3 }}
          disabled={submitting}
        />

        {/* Markdown Editor for Paragraph */}
        <Box sx={{ mb: 3 }} data-color-mode="light">
          <Typography variant="h6" sx={{ mb: 1 }}>
            Content
          </Typography>
          <MDEditor
            value={paragraph}
            onChange={setParagraph}
            height={400}
            preview="edit" // Default to edit mode
          />
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          disabled={submitting || !title || !paragraph}
          sx={{ mt: 2, width: '100%' }}
        >
          {submitting ? 'Updating...' : 'Save Changes'}
        </Button>
      </Box>
    </Card>
  );
};

export default NewsEditForm;