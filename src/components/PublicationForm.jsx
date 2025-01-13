// PublicationForm.jsx

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,  Card,
  CardContent,
  
  CardMedia,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import Slider from 'react-slick'; // <-- Import from react-slick
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const PublicationForm = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [doi, setDoi] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null); // Store the cover image preview URL

  // Existing team-members logic
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  // New: Manage additional authors (unregistered)
  const [newAdditionalAuthor, setNewAdditionalAuthor] = useState('');
  const [additionalAuthors, setAdditionalAuthors] = useState([]);

  // Fetch team members and their details
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = localStorage.getItem('token'); // Fetch token from localStorage
        const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const membersWithDetails = await Promise.all(
          teamRes.data.map(async (member) => {
            const detailsRes = await axiosInstance.get(
              `${API_BASE_URL}/api/team/${member.userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            return {
              ...member,
              details: detailsRes.data
            };
          })
        );
        setTeamMembers(membersWithDetails);
      } catch (error) {
        console.error('Failed to fetch team members or their details', error);
      }
    };
    fetchTeamMembers();
  }, []);

  // Handle addition/removal of registered authors
  const handleAddAuthor = (userId) => {
    if (!selectedAuthors.includes(userId)) {
      setSelectedAuthors((prev) => [...prev, userId]);
    }
  };

  const handleRemoveAuthor = (userId) => {
    setSelectedAuthors((prev) => prev.filter((id) => id !== userId));
  };

  // Handle cover image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  // NEW: Handle additional (unregistered) authors
  const handleAddAdditionalAuthor = () => {
    if (newAdditionalAuthor.trim() !== '') {
      setAdditionalAuthors((prev) => [...prev, newAdditionalAuthor.trim()]);
      setNewAdditionalAuthor('');
    }
  };

  const handleRemoveAdditionalAuthor = (index) => {
    setAdditionalAuthors((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    const formData = new FormData();

    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('doi', doi);
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Append each selected (registered) author ID
    selectedAuthors.forEach((author) => formData.append('authors[]', author));

    // Append each additional (unregistered) author
    additionalAuthors.forEach((author) =>
      formData.append('additionalAuthors[]', author)
    );

    try {
      await axiosInstance.post(`${API_BASE_URL}/api/publications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` // Include token in the request header
        }
      });
      alert('Publication added successfully');
      // Optionally, reset form states here
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // slick slider settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    swipeToSlide: true,
    slidesToShow: 3,   // Number of authors to show at once
    slidesToScroll: 1, // Slides to scroll per click/swipe
    arrows: true,      // Show left/right navigation arrows
    responsive: [
      {
        breakpoint: 960, // <= 960px (tablet)
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600, // <= 600px (mobile)
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Add Publication
      </Typography>

      {/* Title, Summary, DOI */}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="DOI"
        value={doi}
        onChange={(e) => setDoi(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Cover Image */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 2
        }}
      >
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Cover Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {preview && (
          <Card>
      <CardMedia
        component="img"
        sx={{
          maxHeight: 400,
          objectFit: 'cover',
          width: '100%',
          transition: 'transform 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
          },
        }}
        image={preview}
        alt="Research Paper Preview"
        onError={(e) => {
          e.target.src = '/default-cover.jpg';
        }}
      />
    </Card>

        )}
      </Box>

      {/* Carousel for Selecting Registered Authors */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Select Authors (Registered)
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Slider {...sliderSettings}>
          {teamMembers.map((member) => (
            <Box
              key={member.userId}
              sx={{
                px: 1 // spacing between slides
              }}
            >
              <Card
                sx={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  p: 2,
                  '&:hover': {
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Avatar
                    sx={{ width: 100, height: 100 }}
                    src={`${
                      member.details.teamMember.image}`}
                    alt={member.details.teamMember.name}
                  />
                </Box>
                <Typography
                  variant="h6"
                  textAlign="center"
                  sx={{ fontWeight: 'bold' }}
                >
                  {member.details.teamMember.name}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="textSecondary"
                >
                  {member.details.teamMember.role}
                </Typography>
                <Box textAlign="center" sx={{ mt: 2 }}>
                  {selectedAuthors.includes(member.userId) ? (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveAuthor(member.userId)}
                    >
                      Remove
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleAddAuthor(member.userId)}
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Additional Authors (Unregistered) */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Additional Authors (Unregistered)
      </Typography>

      {/* Input field + button to add an unregistered author */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Add an additional author"
          value={newAdditionalAuthor}
          onChange={(e) => setNewAdditionalAuthor(e.target.value)}
          sx={{ mr: 2 }}
        />
        <Button variant="contained" onClick={handleAddAdditionalAuthor}>
          Add
        </Button>
      </Box>

      {/* Display list of additional authors */}
      {additionalAuthors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          {additionalAuthors.map((author, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1
              }}
            >
              <Typography sx={{ mr: 2 }}>
                {index + 1}. {author}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveAdditionalAuthor(index)}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      )}

      {/* Submit Button */}
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>
        Submit
      </Button>
    </Box>
  );
};

export default PublicationForm;
