// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Typography,
//   LinearProgress,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
//   Skeleton,
//   Card,
//   useTheme, // To access theme for breakpoints
//   useMediaQuery, // For responsive design
// } from '@mui/material';
// import MDEditor from '@uiw/react-md-editor';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';

// // Import react-slick and its CSS
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// // Helper function for relative time
// const getRelativeTime = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const msPerMinute = 60 * 1000;
//   const msPerHour = msPerMinute * 60;
//   const msPerDay = msPerHour * 24;
//   const msPerMonth = msPerDay * 30;
//   const msPerYear = msPerDay * 365;

//   const elapsed = now - past;

//   if (isNaN(elapsed) || elapsed < 0) return 'just now';
//   else if (elapsed < msPerMinute) return `${Math.floor(elapsed / msPerMinute)}m ago`;
//   else if (elapsed < msPerHour) return `${Math.floor(elapsed / msPerHour)}h ago`;
//   else if (elapsed < msPerDay) return `${Math.floor(elapsed / msPerDay)}d ago`;
//   else if (elapsed < msPerMonth) return `${Math.floor(elapsed / msPerMonth)}mo ago`;
//   else if (elapsed < msPerYear) return `${Math.floor(elapsed / msPerYear)}y ago`;
//   else return `${Math.floor(elapsed / msPerYear)}y ago`;
// };

// const NewsDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const [news, setNews] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [mainImage, setMainImage] = useState('');
//   const [carouselImages, setCarouselImages] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const newsResponse = await axiosInstance.get(`${API_BASE_URL}/api/news/${id}`);
//         setNews(newsResponse.data);

//         if (newsResponse.data.photos && newsResponse.data.photos.length > 0) {
//           setMainImage(newsResponse.data.photos[0]);
//           // Only set carousel images if there are more than one photo
//           setCarouselImages(newsResponse.data.photos.slice(1));
//         } else {
//           setMainImage('');
//           setCarouselImages([]);
//         }

//       } catch (error) {
//         navigate('/');
//         console.error('Error fetching news:', error);
//         if (error.response && error.response.status === 404) setNews(null);
//       }

//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           setIsAdmin(false);
//           return;
//         }

//         const adminResponse = await axiosInstance.get(`${API_BASE_URL}/api/isAdmin`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setIsAdmin(adminResponse.data.isAdmin);
//       } catch (error) {
//         console.error('Error checking admin status:', error);
//         setIsAdmin(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id, navigate]);

//   const handleDeleteClick = useCallback(() => {
//     setOpenDialog(true);
//   }, []);

//   const handleCloseDialog = useCallback(() => {
//     setOpenDialog(false);
//   }, []);

//   const handleConfirmDelete = useCallback(async () => {
//     setOpenDialog(false);
//     try {
//       const token = localStorage.getItem('token');
//       await axiosInstance.delete(`${API_BASE_URL}/api/news/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       alert('News deleted successfully!');
//       navigate('/news');
//     } catch (error) {
//       console.error('Error deleting news:', error);
//       alert('Failed to delete news. You might not have permission or the news no longer exists.');
//     }
//   }, [id, navigate]);

//   // react-slick settings
//   const sliderSettings = {
//     dots: true,
//     infinite: carouselImages.length > 1, // Only loop if more than one image
//     speed: 500,
//     slidesToShow: isMobile ? 1 : (carouselImages.length < 3 ? carouselImages.length : 3),
//     slidesToScroll: 1,
//     autoplay: carouselImages.length > 1, // Only autoplay if more than one image
//     autoplaySpeed: 3000,
//     arrows: !isMobile && carouselImages.length > 1, // Hide arrows on mobile or if only one image
//     centerMode: !isMobile && carouselImages.length > 1,
//     centerPadding: '60px',
//     responsive: [
//       {
//         breakpoint: theme.breakpoints.values.md,
//         settings: {
//           slidesToShow: carouselImages.length < 2 ? carouselImages.length : 2,
//           slidesToScroll: 1,
//           infinite: carouselImages.length > 1,
//           dots: true,
//           centerMode: carouselImages.length > 1,
//           centerPadding: '40px',
//         }
//       },
//       {
//         breakpoint: theme.breakpoints.values.sm,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: carouselImages.length > 1,
//           dots: true,
//           arrows: false,
//           centerMode: false,
//         }
//       }
//     ]
//   };

//   if (loading) {
//     return (
//       <Box sx={{ mt: 4, px: 3 }}>
//         <LinearProgress sx={{ mb: 2 }} />
//         <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
//         <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
//         <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
//         <Skeleton variant="text" width="100%" height={150} />
//       </Box>
//     );
//   }

//   if (!news) {
//     return (
//       <Typography variant="h5" sx={{ mt: 4, textAlign: 'center', p: 3 }}>
//         News not found.
//       </Typography>
//     );
//   }

//   return (
//     <Box sx={{ py: 4, px: { xs: 2, md: 5 }, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
//       <Card
//         sx={{
//           maxWidth: 1000,
//           mx: 'auto',
//           borderRadius: 2,
//           boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//           overflow: 'hidden',
//         }}
//       >
//         {/* Main Image Section - Always shows if available */}
//         {mainImage && (
//           <Box
//             sx={{
//               width: '100%',
//               height: { xs: 250, sm: 350, md: 450 }, // Responsive height for the main image
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: '#e0e0e0', // Background for empty space
//               borderBottom: carouselImages.length > 0 ? '1px solid #ddd' : 'none', // Border only if carousel follows
//               p: 1, // Small padding around the main image
//               boxSizing: 'border-box',
//             }}
//           >
//             <img
//               src={mainImage}
//               alt="Main News Image"
//               style={{
//                 objectFit: 'contain', // Ensures the whole image is visible
//                 maxWidth: '100%',
//                 maxHeight: '100%',
//                 borderRadius: '8px', // Soft corners for the main image
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // A bit more prominent shadow
//               }}
//             />
//           </Box>
//         )}

//         {/* Carousel for Additional Images - Only shows if there are more than 1 image in total */}
//         {carouselImages.length > 0 && (
//           <Box
//             sx={{
//               p: { xs: 1, sm: 2 }, // Padding around the carousel section
//               backgroundColor: '#f5f5f5', // Slightly different background for carousel
//               borderBottom: '1px solid #ddd',
//               '.slick-prev:before, .slick-next:before': {
//                  color: '#333', // Darker arrows for better visibility
//               },
//               '.slick-dots li button:before': {
//                   color: '#333', // Darker dots
//               },
//               '.slick-active button:before': {
//                   color: theme.palette.primary.main, // Active dot color
//               }
//             }}
//           >
//             <Slider {...sliderSettings}>
//               {carouselImages.map((photoUrl, index) => (
//                 <Box
//                   key={photoUrl}
//                   sx={{
//                     p: 1, // Padding inside each carousel slide item
//                     display: 'flex !important', // Ensure flex for centering within slide
//                     justifyContent: 'center !important',
//                     alignItems: 'center !important',
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: '100%',
//                       height: isMobile ? 150 : 180, // Responsive height for carousel images
//                       borderRadius: '8px',
//                       overflow: 'hidden',
//                       boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                       transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
//                       '&:hover': {
//                         transform: 'scale(1.02)',
//                         boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
//                       },
//                       display: 'flex',
//                       justifyContent: 'center',
//                       alignItems: 'center',
//                       backgroundColor: '#efefef', // Background for empty space in carousel
//                       border: '1px solid #ccc', // Slightly lighter border for carousel images
//                     }}
//                   >
//                     <img
//                       src={photoUrl}
//                       srcSet={photoUrl}
//                       alt={`News carousel image ${index + 1}`}
//                       loading="lazy"
//                       style={{
//                         objectFit: 'contain', // Ensures the whole image is visible
//                         maxWidth: '100%',
//                         maxHeight: '100%',
//                       }}
//                     />
//                   </Box>
//                 </Box>
//               ))}
//             </Slider>
//           </Box>
//         )}

//         <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
//           {/* Title */}
//           <Typography
//             variant="h4"
//             component="h1"
//             gutterBottom
//             sx={{
//               fontWeight: 700,
//               color: '#333',
//               wordBreak: 'break-word',
//               '@media (max-width: 600px)': {
//                 fontSize: '2rem',
//               },
//             }}
//           >
//             {news.title}
//           </Typography>

//           {/* Published Time */}
//           <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
//             Published: {getRelativeTime(news.createdAt)}
//           </Typography>

//           {/* Markdown Body */}
//           <Box sx={{ mt: 3 }} data-color-mode="light">
//             <MDEditor.Markdown
//               source={news.paragraph}
//               sx={{
//                 '& img': {
//                   maxWidth: '100%',
//                   height: 'auto',
//                   display: 'block',
//                   margin: '16px auto',
//                   borderRadius: '8px',
//                   objectFit: 'contain',
//                   border: '1px solid #ddd',
//                   boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
//                 },
//                 '& p': {
//                   lineHeight: 1.8,
//                   fontSize: '1.1rem',
//                   color: '#555',
//                 },
//                 '& h1, & h2, & h3, & h4, & h5, & h6': {
//                   marginTop: '1.5em',
//                   marginBottom: '0.8em',
//                   color: '#333',
//                 },
//                 '& ul, & ol': {
//                   marginLeft: '20px',
//                   color: '#555',
//                 },
//                 '& a': {
//                   color: '#1976d2',
//                   textDecoration: 'underline',
//                 },
//               }}
//             />
//           </Box>

//           {/* Admin Delete Button at Bottom */}
//           {isAdmin && (
//             <Box sx={{ textAlign: 'right', mt: 4 }}>
//               <Button variant="contained" color="error" onClick={handleDeleteClick}>
//                 Delete News
//               </Button>
//             </Box>
//           )}
//         </Box>
//       </Card>

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete this news article? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleConfirmDelete} color="error" autoFocus>
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default NewsDetailPage;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  LinearProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  Card,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MDEditor from '@uiw/react-md-editor';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

// Import react-slick and its CSS
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Helper function for relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = now - past;

  if (isNaN(elapsed) || elapsed < 0) return 'just now';
  else if (elapsed < msPerMinute) return `${Math.floor(elapsed / 1000)}s ago`;
  else if (elapsed < msPerHour) return `${Math.floor(elapsed / msPerMinute)}m ago`;
  else if (elapsed < msPerDay) return `${Math.floor(elapsed / msPerHour)}h ago`;
  else if (elapsed < msPerMonth) return `${Math.floor(elapsed / msPerDay)}d ago`;
  else if (elapsed < msPerYear) return `${Math.floor(elapsed / msPerMonth)}mo ago`;
  else return `${Math.floor(elapsed / msPerYear)}y ago`;
};


const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  // NOTE: Removed mainImage and carouselImages state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const newsResponse = await axiosInstance.get(`${API_BASE_URL}/api/news/${id}`);
        setNews(newsResponse.data);
        // NOTE: Logic to split images into main and carousel is removed.
      } catch (error) {
        navigate('/');
        console.error('Error fetching news:', error);
        if (error.response && error.response.status === 404) setNews(null);
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          return;
        }

        const adminResponse = await axiosInstance.get(`${API_BASE_URL}/api/isAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAdmin(adminResponse.data.isAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleDeleteClick = useCallback(() => {
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    setOpenDialog(false);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`${API_BASE_URL}/api/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('News deleted successfully!');
      navigate('/news');
    } catch (error) {
      console.error('Error deleting news:', error);
      alert('Failed to delete news. You might not have permission or the news no longer exists.');
    }
  }, [id, navigate]);

  // react-slick settings for a single, slidable image card
  const sliderSettings = {
    dots: true,
    infinite: news?.photos?.length > 1, // Loop only if more than one image
    speed: 500,
    slidesToShow: 1, // Always show one image at a time
    slidesToScroll: 1,
    autoplay: news?.photos?.length > 1, // Autoplay if there are multiple images
    autoplaySpeed: 3000,
    arrows: !isMobile && news?.photos?.length > 1, // Show arrows on non-mobile if multiple images
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4, px: 3 }}>
        <LinearProgress sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={150} />
      </Box>
    );
  }

  if (!news) {
    return (
      <Typography variant="h5" sx={{ mt: 4, textAlign: 'center', p: 3 }}>
        News not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ py: 4, px: { xs: 2, md: 5 }, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
      <Card
        sx={{
          maxWidth: 1000,
          mx: 'auto',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          overflow: 'hidden',
        }}
      >
        {/* MODIFIED: Unified Image Slider for all photos */}
        {news.photos && news.photos.length > 0 && (
          <Box
            sx={{
              width: '100%',
              // Use responsive height for a large image display
              height: { xs: 250, sm: 350, md: 450 },
              '.slick-prev:before, .slick-next:before': { color: theme.palette.text.primary },
              '.slick-dots li button:before': { color: theme.palette.text.secondary },
              '.slick-active button:before': { color: theme.palette.primary.main }
            }}
          >
            <Slider {...sliderSettings}>
              {news.photos.map((photoUrl, index) => (
                <Box
                  key={photoUrl}
                  sx={{
                    // Ensure the slide container matches the slider's height
                    height: { xs: 250, sm: 350, md: 450 },
                    display: 'flex !important',
                    justifyContent: 'center !important',
                    alignItems: 'center !important',
                    backgroundColor: '#e0e0e0', // Background for letterboxing
                  }}
                >
                  <img
                    src={photoUrl}
                    alt={`News image ${index + 1}`}
                    loading="lazy"
                    style={{
                      objectFit: 'contain', // Ensures the whole image is visible
                      maxWidth: '100%',
                      maxHeight: '100%',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
              ))}
            </Slider>
          </Box>
        )}

        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {/* Title */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#333',
              wordBreak: 'break-word',
              mt: news.photos && news.photos.length > 0 ? 2 : 0, // Add margin top if images are present
              '@media (max-width: 600px)': { fontSize: '2rem' },
            }}
          >
            {news.title}
          </Typography>

          {/* Published Time */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
            Published: {getRelativeTime(news.createdAt)}
          </Typography>

          {/* Markdown Body */}
          <Box sx={{ mt: 3 }} data-color-mode="light">
            <MDEditor.Markdown
              source={news.paragraph}
              sx={{
                '& img': {
                  maxWidth: '100%', height: 'auto', display: 'block', margin: '16px auto',
                  borderRadius: '8px', objectFit: 'contain', border: '1px solid #ddd',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                },
                '& p': { lineHeight: 1.8, fontSize: '1.1rem', color: '#555' },
                '& h1, & h2, & h3, & h4, & h5, & h6': { mt: '1.5em', mb: '0.8em', color: '#333' },
                '& ul, & ol': { ml: '20px', color: '#555' },
                '& a': { color: '#1976d2', textDecoration: 'underline' },
              }}
            />
          </Box>

          {/* Admin Delete Button at Bottom */}
          {isAdmin && (
            <Box sx={{ textAlign: 'right', mt: 4 }}>
              <Button variant="contained" color="error" onClick={handleDeleteClick}>
                Delete News
              </Button>
            </Box>
          )}
        </Box>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this news article? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsDetailPage;