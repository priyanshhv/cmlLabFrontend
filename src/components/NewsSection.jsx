// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Box,
//   Skeleton
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import Slider from 'react-slick';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';

// const getRelativeTime = (date) => {
//   const now = new Date();
//   const past = new Date(date);
//   const msPerMinute = 60 * 1000;
//   const msPerHour = msPerMinute * 60;
//   const msPerDay = msPerHour * 24;
//   const msPerMonth = msPerDay * 30;
//   const msPerYear = msPerDay * 365;

//   const elapsed = now - past;

//   // Handle invalid dates
//   if (isNaN(elapsed)) {
//     return 'Invalid date';
//   }

//   // Handle future dates
//   if (elapsed < 0) {
//     return 'just now';
//   }

//   // Calculate time differences
//   if (elapsed < msPerMinute) {
//     return 'just now';
//   } else if (elapsed < msPerHour) {
//     const minutes = Math.floor(elapsed / msPerMinute);
//     return `${minutes}m ago`;
//   } else if (elapsed < msPerDay) {
//     const hours = Math.floor(elapsed / msPerHour);
//     return `${hours}h ago`;
//   } else if (elapsed < msPerMonth) {
//     const days = Math.floor(elapsed / msPerDay);
//     return `${days}d ago`;
//   } else if (elapsed < msPerYear) {
//     const months = Math.floor(elapsed / msPerMonth);
//     return `${months}mo ago`;
//   } else {
//     const years = Math.floor(elapsed / msPerYear);
//     return `${years}y ago`;
//   }
// };

// const NewsSection = () => {
//   const [news, setNews] = useState([]);
//   const [loading, setLoading] = useState(true);
//    const [selectedId, setSelectedId] = useState(null); // <-- Add this


//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const response = await axiosInstance.get(`${API_BASE_URL}/api/news`);
//         setNews(response.data);
//       } catch (error) {
//         console.error('Failed to fetch news:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNews();
//   }, []);

//   const settings = {
//     infinite: news.length > 3,
//     speed: 1200,
//     cssEase: 'ease-in-out',
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     swipeToSlide: true,
//     adaptiveHeight: false,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 960,
//         settings: {
//           slidesToShow: 2,
//         },
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//         },
//       },
//     ],
//   };

//   return (
//      <Box sx={{ py: 5, px: 3 }}>
//       <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
//         Latest News
//       </Typography>

//       {loading ? (
//         <Grid container spacing={3}>
//           {Array.from({ length: 3 }).map((_, index) => (
//             <Grid item xs={12} sm={6} md={4} key={index}>
//               <Skeleton variant="rectangular" width="100%" height={300} />
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Box
//           sx={{
//             maxWidth: { xs: '100%', sm: '90%', md: '80%' },
//             margin: '0 auto',
//           }}
//         >
//           <Slider {...settings}>
//             {news.map((item) => (
//               <Box key={item._id} sx={{ p: 1 }}>
//                 <Card
//                   sx={{
//                     height: 300,
//                     position: 'relative',
//                     textDecoration: 'none',
//                     borderRadius: '1rem',
//                     overflow: 'hidden',
//                     transition: 'transform 0.3s',
//                     '&:hover': {
//                       transform: 'translateY(-4px)',
//                       boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//                     },
//                   }}
//                   onClick={() => setSelectedId(item._id)} // <-- Add this
//                 >
//                   <CardMedia
//                     component="img"
//                     image={item.photos[0] || '/default-news-image.jpg'}
//                     alt={item.title}
//                     sx={{
//                       objectFit: 'cover',
//                       width: '100%',
//                       height: '100%',
//                       transition: 'transform 0.3s',
//                       '&:hover': { transform: 'scale(1.05)' }
//                     }}
//                   />
//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
//                       p: 2, // Keep padding here, or use specific paddings as in Option 1
//                       height: 100,
//                       // Ensure the Box itself has relative positioning (already set with 'absolute' here)
//                       // to act as the positioning context for its children.
//                     }}
//                   >
//                     {/* Time on the left */}
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         color: 'rgba(255,255,255,0.8)',
//                         position: 'absolute', // Keep absolute
//                         bottom: 16,
//                         left: 16, // Keep left
//                         fontWeight: 500,
//                       }}
//                     >
//                       {getRelativeTime(item.createdAt)}
//                     </Typography>

//                     {/* Title on the right */}
//                     <Link
//                       to={`/news/${item._id}`}
//                       style={{ textDecoration: 'none' }}
//                       tabIndex={-1}
//                     >
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           color: 'white',
//                           textAlign: 'right',
//                           textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
//                           fontWeight: 600,
//                           fontSize: '1.1rem',
//                           lineHeight: 1.2,
//                           whiteSpace: 'nowrap',
//                           overflow: 'hidden',
//                           textOverflow: 'ellipsis',
//                           cursor: 'pointer',
//                           transition: 'color 0.2s',
//                           position: 'absolute', // Add absolute positioning
//                           bottom: 16,          // Align with time
//                           right: 16,           // Align to the right
//                           left: 100,           // Add a 'left' boundary to prevent overlap with time
//                           // Or better: calculate left dynamically based on time width + gap
//                           // For simplicity, a fixed 'left' or 'margin-left' after time element
//                           // is tricky with absolute. maxWidth is more reliable here.
//                           maxWidth: 'calc(100% - 100px)', // Example: 100px for time + padding
//                           '&:hover': {
//                             color: '#2196F3',
//                             textDecoration: 'underline',
//                           },
//                           '@media (max-width: 600px)': {
//                             fontSize: '1.2rem',
//                             padding: '8px 0',
//                           },
//                         }}
//                       >
//                         {selectedId === item._id ? (
//                           <marquee behavior="scroll" direction="left" scrollamount="5" style={{ width: '100%' }}>
//                             {item.title}
//                           </marquee>
//                         ) : (
//                           item.title
//                         )}
//                       </Typography>
//                     </Link>
//                   </Box>
//                 </Card>
//               </Box>
//             ))}
//           </Slider>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default NewsSection;

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';

const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = now - past;

  // Handle invalid dates
  if (isNaN(elapsed)) {
    return 'Invalid date';
  }

  // Handle future dates
  if (elapsed < 0) {
    return 'just now';
  }

  // Calculate time differences
  if (elapsed < msPerMinute) {
    return 'just now';
  } else if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes}m ago`;
  } else if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours}h ago`;
  } else if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return `${days}d ago`;
  } else if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return `${months}mo ago`;
  } else {
    const years = Math.floor(elapsed / msPerYear);
    return `${years}y ago`;
  }
};

const NewsSection = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null); // <-- Add this


  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/api/news`);
        setNews(response.data);
      } catch (error) {
        console.error('Failed to fetch news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const settings = {
    infinite: news.length > 3,
    speed: 1200,
    cssEase: 'ease-in-out',
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    adaptiveHeight: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ py: 5, px: { xs: 0, md: 3 } }}>
      {/* Conditionally render "Latest News" only if there is news or if still loading */}
      {(loading || news.length > 0) && (
        <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
          Latest News
        </Typography>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" width="100%" height={300} />
            </Grid>
          ))}
        </Grid>
      ) : (
        news.length > 0 ? ( // Only render the slider if there's news
          <Box
            sx={{
              maxWidth: { xs: '90%', sm: '80%', md: '60%' },
              margin: '0 auto',
            }}
          >
            <Slider {...settings}>
              {news.map((item) => (
                <Box key={item._id} sx={{ p: 1 }}>
                  <Card
                    sx={{
                      // height: 300,
                      position: 'relative',
                      textDecoration: 'none',
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      },
                    }}
                    onClick={() => setSelectedId(item._id)} // <-- Add this
                  >
                    <CardMedia
                      component="img"
                      image={item.photos[0] || '/default-news-image.jpg'}
                      alt={item.title}
                      sx={{
                        objectFit: 'cover',
                        width: '100%',
                        maxHeight: 400,
                        transition: 'transform 0.3s',
                        '&:hover': { transform: 'scale(1.05)' }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        p: 2,
                        height: 100,
                      }}
                    >
                      {/* Time on the left */}
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(255,255,255,0.8)',
                          position: 'absolute',
                          bottom: 16,
                          left: 16,
                          fontWeight: 500,
                        }}
                      >
                        {getRelativeTime(item.createdAt)}
                      </Typography>

                      {/* Title on the right */}
                      <Link
                        to={`/news/${item._id}`}
                        style={{ textDecoration: 'none' }}
                        tabIndex={-1}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: 'white',
                            textAlign: 'right',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
                            fontWeight: 600,
                            fontSize: '1.1rem',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                            transition: 'color 0.2s, text-decoration 0.2s',
                            position: 'absolute',
                            bottom: 16,
                            right: 16,
                            left: 100,
                            maxWidth: 'calc(100% - 100px)',
                            '&:hover': {
                              color: '#2196F3',
                              textDecoration: 'underline',
                            },
                            '@media (max-width: 600px)': {
                              fontSize: '1.2rem',
                              padding: '8px 0',
                            },
                          }}
                        >
                          {selectedId === item._id ? (
                            <marquee behavior="scroll" direction="left" scrollamount="5" style={{ width: '100%' }}>
                              {`${item.title}\u00A0→`}
                            </marquee>
                          ) : (
                            `${item.title}\u00A0→`
                          )}
                        </Typography>
                      </Link>
                    </Box>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
            No news available at the moment.
          </Typography>
        )
      )}
    </Box>
  );
};

export default NewsSection;