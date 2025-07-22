import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  ImageList,
  ImageListItem,
  Card,
  CardMedia,
} from '@mui/material';
import MDEditor from '@uiw/react-md-editor'; // For markdown editing
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const NewsForm = () => {
  const [title, setTitle] = useState('');
  const [paragraph, setParagraph] = useState('');
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]); // For image previews
  const [loading, setLoading] = useState(false);

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Create preview URLs for selected images
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    
    // Store the actual files
    setPhotos(prev => [...prev, ...files]);
  };

  // Remove photo at specific index
  const handleRemovePhoto = (index) => {
    URL.revokeObjectURL(previews[index]); // Clean up preview URL
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('paragraph', paragraph);
      
      // Append each photo to formData
      photos.forEach(photo => {
        formData.append('photos', photo);
      });

      await axiosInstance.post(`${API_BASE_URL}/api/news`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           Authorization: `Bearer ${token}` // Include token in the request header
        }
      });

      // Reset form after successful submission
      setTitle('');
      setParagraph('');
      setPhotos([]);
      setPreviews([]);
      alert('News added successfully!');
    } catch (error) {
      console.error('Error adding news:', error);
      alert('Failed to add news. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Add News
      </Typography>

      {/* Title Field */}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Markdown Editor for Paragraph */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Content
        </Typography>
        <MDEditor
          value={paragraph}
          onChange={setParagraph}
          height={300}
        />
      </Box>

      {/* Photo Upload */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2 }}
        >
          Upload Photos
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handlePhotoChange}
          />
        </Button>        

        {/* Image Previews */}
        {previews.length > 0 && (
          <ImageList sx={{ width: '100%', height: 'auto' }} cols={3} rowHeight={200}>
            {previews.map((preview, index) => (
              <ImageListItem key={index}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image={preview}
                    alt={`Preview ${index + 1}`}
                  />
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleRemovePhoto(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      minWidth: 'auto',
                      width: 30,
                      height: 30,
                      p: 0,
                    }}
                  >
                    ×
                  </Button>
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !title || !paragraph}
        sx={{ mt: 2 }}
      >
        {loading ? 'Adding News...' : 'Add News'}
      </Button>
    </Box>
  );
};

export default NewsForm;