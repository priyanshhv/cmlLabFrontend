// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Typography,
//   Box,
//   Skeleton,
//   Link as MuiLink
// } from '@mui/material';
// import Carousel from 'react-material-ui-carousel';
// import { Link } from 'react-router-dom';
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';

// /**
//  * Utility to combine registered/unregistered authors into a single comma-separated list
//  */
// function renderAuthors(registeredAuthors = [], unregisteredAuthors = []) {
//   const registeredEls = registeredAuthors.map((author, idx) => (
//     <React.Fragment key={author.userId}>
//       {idx > 0 && ', '}
//       <MuiLink
//         component={Link}
//         to={`/users/${author.userId}`}
//         underline="hover"
//         sx={{ color: 'inherit', fontWeight: 'bold' }}
//       >
//         {author.name}
//       </MuiLink>
//     </React.Fragment>
//   ));

//   const unregisteredEls = unregisteredAuthors.map((authorName, idx) => {
//     const shouldAddComma = registeredAuthors.length > 0 || idx > 0;
//     return (
//       <React.Fragment key={`unreg-${idx}`}>
//         {shouldAddComma && ', '}
//         {authorName}
//       </React.Fragment>
//     );
//   });

//   return [...registeredEls, ...unregisteredEls];
// }

// export default function PublicationsSection() {
//   // We'll store the selected year as a dayjs object
//   const [selectedYear, setSelectedYear] = useState(dayjs()); 
//   const [publications, setPublications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch publications whenever the user changes the year
//   useEffect(() => {
//     const fetchPublicationsByYear = async () => {
//       try {
//         setLoading(true);
//         const yearNum = selectedYear.year(); // e.g. 2023
//         // GET /api/publications/year/<yearNum>
//         const res = await axiosInstance.get(`${API_BASE_URL}/api/publications/year/${yearNum}`);

//         // For each publication, retrieve registered/unregistered authors
//         const pubsWithAuthors = await Promise.all(
//           res.data.map(async (pub) => {
//             const pubAuthors = Array.isArray(pub.authors) ? pub.authors : [];
//             const pubAdditional = Array.isArray(pub.additionalAuthors)
//               ? pub.additionalAuthors
//               : [];

//             // For each registered author, fetch user info
//             const registeredAuthorsDetails = await Promise.all(
//               pubAuthors.map(async (authorId) => {
//                 const authorRes = await axiosInstance.get(
//                   `${API_BASE_URL}/api/team/${authorId}`
//                 );
//                 return {
//                   userId: authorId,
//                   name: authorRes.data.teamMember.name
//                 };
//               })
//             );

//             return {
//               ...pub,
//               registeredAuthors: registeredAuthorsDetails,
//               unregisteredAuthors: pubAdditional
//             };
//           })
//         );

//         setPublications(pubsWithAuthors);
//       } catch (error) {
//         console.error('Failed to fetch publications', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPublicationsByYear();
//   }, [selectedYear]);

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         minHeight:'100vh',
//         py: 5,
//         // Elegant gradient background
//         background: 'linear-gradient(135deg, #c0c0ff 0%, #e1e0fa 50%, #fefefe 100%)'
//       }}
//     >
//       {/* Title */}
//       <Typography
//         variant="h4"
//         sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}
//       >
//         Publications by Year
//       </Typography>

//       {/* Year Picker */}
//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <DesktopDatePicker
//             label="Select Year"
//             views={['year']}
//             value={selectedYear}
//             onChange={(newValue) => {
//               setSelectedYear(newValue);
//             }}
//             renderInput={(params) => (
//               <params.TextField
//                 {...params}
//                 sx={{
//                   width: 200,
//                   '& .MuiInputBase-input': {
//                     fontSize: '1.25rem',
//                     fontWeight: 'bold'
//                   }
//                 }}
//               />
//             )}
//           />
//         </LocalizationProvider>
//       </Box>

//       {loading ? (
//         // Show skeleton placeholders
//         <Grid container spacing={3} sx={{ px: 3 }}>
//           {Array.from({ length: 4 }).map((_, idx) => (
//             <Grid item xs={12} sm={6} md={3} key={idx}>
//               <Skeleton variant="rectangular" width="100%" height={220} />
//             </Grid>
//           ))}
//         </Grid>
//       ) : publications.length === 0 ? (
//         <Typography
//           variant="body1"
//           color="textSecondary"
//           sx={{ textAlign: 'center', mt: 3 }}
//         >
//           No publications found for {selectedYear.year()}.
//         </Typography>
//       ) : (
//         // Glassmorphic carousel container
//         <Box
//           sx={{
//             width: { xs: '95%', sm: '80%', md: '70%' },
//             margin: '0 auto',
//             boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//             borderRadius: '1rem',
//             overflow: 'hidden',
//             backgroundColor: 'rgba(255, 255, 255, 0.6)',
//             backdropFilter: 'blur(8px)'
//           }}
//         >
//           <Carousel
//             autoPlay
//             interval={5000}
//             indicators
//             swipe
//             cycleNavigation
//             navButtonsAlwaysVisible
//             fullHeightHover={false}
//             animation="slide"
//             duration={1200}
//           >
//             {publications.map((pub) => (
//               <PublicationSlide key={pub._id} publication={pub} />
//             ))}
//           </Carousel>
//         </Box>
//       )}
//     </Box>
//   );
// }

// /**
//  * Single slide representing one publication (with the fancy overlay).
//  */
// function PublicationSlide({ publication }) {
//   const authors = renderAuthors(
//     publication.registeredAuthors,
//     publication.unregisteredAuthors
//   );

//   return (
//     <Box
//       sx={{
//         position: 'relative',
//         width: '100%',
//         height: { xs: 380, md: 440 },
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         overflow: 'hidden',
//         borderRadius: '1rem'
//       }}
//     >
//       {/* Background image */}
//       <Box
//         component="img"
//         src={`${API_BASE_URL}/${publication.coverImage}`}
//         onError={(e) => {
//           e.target.src = '/default-cover.jpg';
//         }}
//         alt={publication.title}
//         sx={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           objectFit: 'cover',
//           zIndex: 0,
//           transition: 'transform 0.4s ease',
//           '&:hover': {
//             transform: 'scale(1.05)'
//           }
//         }}
//       />

//       {/* Overlay with details */}
//       <Box
//         sx={{
//           position: 'absolute',
//           bottom: 0,
//           width: '100%',
//           padding: '1rem',
//           color: '#fff',
//           background:
//             'linear-gradient(0deg, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0) 100%)'
//         }}
//       >
//         <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
//           {publication.title}
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{
//             maxHeight: 80,
//             overflow: 'hidden',
//             textOverflow: 'ellipsis',
//             color: '#ddd'
//           }}
//         >
//           {publication.summary}
//         </Typography>
//         <Typography variant="body2" sx={{ mt: 1, color: '#ddd' }}>
//           <strong>Authors: </strong> {authors}
//         </Typography>
//         {publication.doi && (
//           <MuiLink
//             href={publication.doi}
//             target="_blank"
//             rel="noopener noreferrer"
//             underline="hover"
//             sx={{ color: '#ffe28c', display: 'inline-block', mt: 1 }}
//           >
//             Read Full Article
//           </MuiLink>
//         )}
//       </Box>
//     </Box>
//   );
// }

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Skeleton,
  Link as MuiLink
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
        const res = await axiosInstance.get(`${API_BASE_URL}/api/publications/year/${yearNum}`);

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
        minHeight:'100vh',
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
            width: { xs: '95%', sm: '80%', md: '70%' },
            margin: '0 auto',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '1rem',
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(8px)'
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
              <PublicationSlide key={pub._id} publication={pub} />
            ))}
          </Carousel>
        </Box>
      )}
    </Box>
  );
}

function PublicationSlide({ publication }) {
  const authors = renderAuthors(
    publication.registeredAuthors,
    publication.unregisteredAuthors
  );

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 380, md: 440 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: '1rem'
      }}
    >
      <Box
        component="img"
        src={`${API_BASE_URL}/${publication.coverImage}`}
        onError={(e) => {
          e.target.src = '/default-cover.jpg';
        }}
        alt={publication.title}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          transition: 'transform 0.4s ease',
          '&:hover': {
            transform: 'scale(1.05)'
          }
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '1rem',
          color: '#fff',
          background:
            'linear-gradient(0deg, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 100%)'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          {publication.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            maxHeight: 80,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#ddd'
          }}
        >
          {truncateSummary(publication.summary)}
          {publication.summary.split(' ').length > 80 && publication.doi && (
            <MuiLink
              href={publication.doi}
              sx={{ 
                ml: 1, 
                color: '#ffe28c',
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
        <Typography variant="body2" sx={{ mt: 1, color: '#ddd' }}>
          <strong>Authors: </strong> {authors}
        </Typography>
        {publication.doi && (
          <MuiLink
            href={publication.doi}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{ color: '#ffe28c', display: 'inline-block', mt: 1 }}
          >
            Read Full Article
          </MuiLink>
        )}
      </Box>
    </Box>
  );
}