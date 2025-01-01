

// // // components/PublicationForm.jsx
// // import React, { useState, useEffect } from 'react';
// // import { TextField, Button, Box, Typography, Grid, Card, CardContent } from '@mui/material';
// // import axiosInstance from '../axiosInstance';
// // import { API_BASE_URL } from '../config';

// // const PublicationForm = () => {
// //     const [title, setTitle] = useState('');
// //     const [summary, setSummary] = useState('');
// //     const [doi, setDoi] = useState('');
// //     const [coverImage, setCoverImage] = useState(null);
// //     const [teamMembers, setTeamMembers] = useState([]);
// //     const [selectedAuthors, setSelectedAuthors] = useState([]);
// //     const [addingAuthor, setAddingAuthor] = useState([]); // Track adding author state

// //     // Fetch team members and their details
// //     useEffect(() => {
// //         const fetchTeamMembers = async () => {
// //             try {
// //                 const token = localStorage.getItem('token'); // Fetch token from localStorage
// //                 const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
// //                     headers: {
// //                         Authorization: `Bearer ${token}`,
// //                     },
// //                 });
// //                 const membersWithDetails = await Promise.all(
// //                     teamRes.data.map(async (member) => {
// //                         const detailsRes = await axiosInstance.get(`${API_BASE_URL}/api/team/${member.userId}`, {
// //                             headers: {
// //                                 Authorization: `Bearer ${token}`,
// //                             },
// //                         });
// //                         return {
// //                             ...member,
// //                             details: detailsRes.data,
// //                         };
// //                     })
// //                 );
// //                 setTeamMembers(membersWithDetails);
// //             } catch (error) {
// //                 console.error('Failed to fetch team members or their details', error);
// //             }
// //         };
// //         fetchTeamMembers();
// //     }, []);

// //     const handleAddAuthor = (userId) => {
// //         if (!selectedAuthors.includes(userId)) {
// //             setSelectedAuthors((prev) => [...prev, userId]);
// //         }
// //     };

// //     const handleRemoveAuthor = (userId) => {
// //         setSelectedAuthors((prev) => prev.filter((id) => id !== userId));
// //     };

// //     const handleSubmit = async () => {
// //         const token = localStorage.getItem('token'); // Fetch token from localStorage
// //         const formData = new FormData();
// //         formData.append('title', title);
// //         formData.append('summary', summary);
// //         formData.append('doi', doi);
// //         formData.append('coverImage', coverImage);
// //         selectedAuthors.forEach((author) => formData.append('authors[]', author)); // Append each author separately

// //         try {
// //             await axiosInstance.post(`${API_BASE_URL}/api/publications`, formData, {
// //                 headers: {
// //                     'Content-Type': 'multipart/form-data',
// //                     Authorization: `Bearer ${token}`, // Include token in the request header
// //                 },
// //             });
// //             alert('Publication added successfully');
// //         } catch (error) {
// //             console.error(error.response?.data || error.message);
// //         }
// //     };

// //     return (
// //         <Box>
// //             <Typography variant="h4" sx={{ mb: 3 }}>Add Publication</Typography>
// //             <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
// //             <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} fullWidth sx={{ mb: 2 }} />
// //             <TextField label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} fullWidth sx={{ mb: 2 }} />
// //             <Button
// //                 variant="contained"
// //                 component="label"
// //                 sx={{ mb: 2 }}
// //             >
// //                 Upload Cover Image
// //                 <input
// //                     type="file"
// //                     hidden
// //                     onChange={(e) => setCoverImage(e.target.files[0])}
// //                 />
// //             </Button>

// //             <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Select Authors</Typography>
// //             <Grid container spacing={2}>
// //                 {teamMembers.map((member) => (
// //                     <Grid item xs={12} sm={6} md={4} key={member.userId}>
// //                         <Card>
// //                             <CardContent>
// //                                 <Typography variant="h6">{member.details.teamMember.name}</Typography>
// //                                 <Typography variant="body2" color="textSecondary">
// //                                     {member.details.teamMember.role}
// //                                 </Typography>
                               
// //                                 {selectedAuthors.includes(member.userId) ? (
// //                                     <Button
// //                                         variant="outlined"
// //                                         color="error"
// //                                         onClick={() => handleRemoveAuthor(member.userId)}
// //                                     >
// //                                         Remove
// //                                     </Button>
// //                                 ) : (
// //                                     <Button
// //                                         variant="contained"
// //                                         onClick={() => handleAddAuthor(member.userId)}
// //                                     >
// //                                         Add
// //                                     </Button>
// //                                 )}
// //                             </CardContent>
// //                         </Card>
// //                     </Grid>
// //                 ))}
// //             </Grid>

// //             <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>Submit</Button>
// //         </Box>
// //     );
// // };

// // export default PublicationForm;

// import React, { useState, useEffect } from 'react';
// import { TextField, Button, Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';

// const PublicationForm = () => {
//     const [title, setTitle] = useState('');
//     const [summary, setSummary] = useState('');
//     const [doi, setDoi] = useState('');
//     const [coverImage, setCoverImage] = useState(null);
//     const [preview, setPreview] = useState(null); // Store the cover image preview URL
//     const [teamMembers, setTeamMembers] = useState([]);
//     const [selectedAuthors, setSelectedAuthors] = useState([]);

//     // Fetch team members and their details
//     useEffect(() => {
//         const fetchTeamMembers = async () => {
//             try {
//                 const token = localStorage.getItem('token'); // Fetch token from localStorage
//                 const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//                 const membersWithDetails = await Promise.all(
//                     teamRes.data.map(async (member) => {
//                         const detailsRes = await axiosInstance.get(`${API_BASE_URL}/api/team/${member.userId}`, {
//                             headers: {
//                                 Authorization: `Bearer ${token}`,
//                             },
//                         });
//                         return {
//                             ...member,
//                             details: detailsRes.data,
//                         };
//                     })
//                 );
//                 setTeamMembers(membersWithDetails);
//             } catch (error) {
//                 console.error('Failed to fetch team members or their details', error);
//             }
//         };
//         fetchTeamMembers();
//     }, []);

//     const handleAddAuthor = (userId) => {
//         if (!selectedAuthors.includes(userId)) {
//             setSelectedAuthors((prev) => [...prev, userId]);
//         }
//     };

//     const handleRemoveAuthor = (userId) => {
//         setSelectedAuthors((prev) => prev.filter((id) => id !== userId));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             setCoverImage(file);
//             setPreview(URL.createObjectURL(file)); // Create a preview URL for the image
//         }
//     };

//     const handleSubmit = async () => {
//         const token = localStorage.getItem('token'); // Fetch token from localStorage
//         const formData = new FormData();
//         formData.append('title', title);
//         formData.append('summary', summary);
//         formData.append('doi', doi);
//         formData.append('coverImage', coverImage);
//         selectedAuthors.forEach((author) => formData.append('authors[]', author)); // Append each author separately

//         try {
//             await axiosInstance.post(`${API_BASE_URL}/api/publications`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${token}`, // Include token in the request header
//                 },
//             });
//             alert('Publication added successfully');
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//         }
//     };

//     return (
//         <Box>
//             <Typography variant="h4" sx={{ mb: 3 }}>Add Publication</Typography>
//             <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{ mb: 2 }} />
//             <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} fullWidth sx={{ mb: 2 }} />
//             <TextField label="DOI" value={doi} onChange={(e) => setDoi(e.target.value)} fullWidth sx={{ mb: 2 }} />
//             <Box
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     py: 2,
//                 }}
//             >
//                 <Button
//                     variant="contained"
//                     component="label"
//                     sx={{ mb: 2, display: 'block' }}
//                 >
//                     Upload Cover Image
//                     <input
//                         type="file"
//                         hidden
//                         accept="image/*"
//                         onChange={handleImageChange}
//                     />
//                 </Button>
//                 {preview && (
//                     <Avatar
//                         src={preview}
//                         alt="Preview"
//                         sx={{ width: 100, height: 100, mb: 2 }}
//                     />
//                 )}
//             </Box>

//             <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Select Authors</Typography>
//             <Grid container spacing={2}>
//                 {teamMembers.map((member) => (
//                     <Grid item xs={12} sm={6} md={4} key={member.userId}>
//                         <Card>
//                             <CardContent>
//                                   <Box sx={{ display: 'flex', alignItems: 'center',justifyContent:"center", mb: 2 }}>
//                                                                                                                 <Avatar
//                                                                                                                     sx={{ width: 100, height: 100, mr: 2 }}
//                                                                                                                     src={`${API_BASE_URL}/${member.details.teamMember.image || 'default-avatar.jpg'}`}
//                                                                                                                 /> 
//                                                                                                             </Box>
//                                                                                                              <Typography variant="h6" textAlign={"center"}><strong>{member.details.teamMember.name}</strong></Typography>
//                                 <Typography variant="body2" textAlign={"center"} color="textSecondary">
//                                     {member.details.teamMember.role}
//                                 </Typography>
//                                 <Box textAlign={"center"}>
//                                 {selectedAuthors.includes(member.userId) ? (
//                                     <Button
//                                         variant="outlined"
//                                         color="error"
//                                         onClick={() => handleRemoveAuthor(member.userId)}
//                                     >
//                                         Remove
//                                     </Button>
//                                 ) : (
//                                     <Button
//                                         variant="contained"
//                                         onClick={() => handleAddAuthor(member.userId)}
//                                     >
//                                         Add
//                                     </Button>
//                                 )}
//                                 </Box>
//                             </CardContent>
//                         </Card>
//                     </Grid>
//                 ))}
//             </Grid>

//             <Button variant="contained" onClick={handleSubmit} sx={{ mt: 3 }}>Submit</Button>
//         </Box>
//     );
// };

// export default PublicationForm;
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent
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
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

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

  const handleAddAuthor = (userId) => {
    if (!selectedAuthors.includes(userId)) {
      setSelectedAuthors((prev) => [...prev, userId]);
    }
  };

  const handleRemoveAuthor = (userId) => {
    setSelectedAuthors((prev) => prev.filter((id) => id !== userId));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreview(URL.createObjectURL(file)); // Create a preview URL for the image
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token'); // Fetch token from localStorage
    const formData = new FormData();
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('doi', doi);
    formData.append('coverImage', coverImage);
    selectedAuthors.forEach((author) => formData.append('authors[]', author)); // Append each author separately

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
    dots: true,
    infinite: true,
    speed: 700,
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
      <Typography variant="h4" sx={{ mb: 3 }}>
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
          <Avatar
            src={preview}
            alt="Preview"
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        )}
      </Box>

      {/* Carousel for Selecting Authors */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Select Authors
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
                    src={`${API_BASE_URL}/${
                      member.details.teamMember.image || 'default-avatar.jpg'
                    }`}
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

      <Button
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Submit
      </Button>
    </Box>
  );
};

export default PublicationForm;
