

// import React, { useEffect, useState } from 'react';
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
//   Avatar,
//   Skeleton
// } from '@mui/material';
// import Slider from 'react-slick';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';
// import { Link } from 'react-router-dom';

// const TeamSection = () => {
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [alumniMembers, setAlumniMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//  useEffect(() => {
//   const fetchTeamData = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       // Fetch team data first
//       const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const teamMembers = teamRes.data;

//       // Map userId to fetch user data for each team member
//       const userDetails = await Promise.all(
//         teamMembers.map(async (teamMember) => {
//           const userRes = await axiosInstance.get(`${API_BASE_URL}/api/user/${teamMember.userId}`, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//           return {
//             ...userRes.data,
//             isAlumni: teamMember.isAlumni, // Include alumni status from team data
//           };
//         })
//       );

//       // Separate users into team members and alumni
//       setTeamMembers(userDetails.filter((user) => !user.isAlumni));
//       setAlumniMembers(userDetails.filter((user) => user.isAlumni));
//     } catch (error) {
//       console.error('Failed to fetch team data', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchTeamData();
// }, []);


//   // Slick Slider Settings for an extra smooth transition
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   speed: 1200,
  //   cssEase: 'ease-in-out',
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 1000,
  //   arrows: true,
  //   responsive: [
  //     {
  //       breakpoint: 960,
  //       settings: {
  //         slidesToShow: 2
  //       },
  //     },
  //     {
  //       breakpoint: 600,
  //       settings: {
  //         slidesToShow: 1
  //       },
  //     },
  //   ],
  // };

//   const renderUsers = (users, title) => (
//     <Box sx={{ py: 5 }}>
//       <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
//         {title}
//       </Typography>

//       {loading ? (
//         <Grid container spacing={3}>
//           {Array.from({ length: 3 }).map((_, index) => (
//             <Grid item xs={12} sm={12} md={12} key={index}>
//               <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
//                 <Skeleton variant="circular" width={120} height={120} />
//               </Box>
//               <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   flexDirection: 'column',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Skeleton variant="text" width={100} height={24} />
//                 <Skeleton variant="text" width={80} height={20} />
//                 <Skeleton variant="text" width={150} height={20} />
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       ) : (
//         <Box
//           sx={{
//             maxWidth: '80%',
//             margin: '0 auto',
//           }}
//         >
//           <Slider {...settings}>
//             {users.map((user) => (
//               <Box key={user._id} sx={{ p: 1 }}>
//                 <Card
//                   sx={{
//                     borderRadius: '1rem',
//                     background:
//                       'linear-gradient(45deg, #e53238 0%, #f5af02 25%, #86b817 50%, #0064d2 75%)',
//                     color: '#fff',
//                     overflow: 'hidden',
//                     '&:hover': {
//                       boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//                     },
//                     height: '100%',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     justifyContent: 'space-between',
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       backgroundColor: '#fff',
//                       display: 'flex',
//                       justifyContent: 'center',
//                       pt: 3,
//                       pb: 1,
//                     }}
//                   >
//                     <Avatar
//                       component={Link}
//                       to={`/users/${user._id}`}
//                       sx={{ width: 120, height: 120 }}
//                       src={`${API_BASE_URL}/${user.image || 'default-avatar.jpg'}`}
//                       alt={user.name}
//                     />
//                   </Box>

//                   <CardContent
//                     sx={{
//                       backgroundColor: '#fff',
//                       color: '#333',
//                       textAlign: 'center',
//                       pt: 0,
//                     }}
//                   >
//                     <Typography variant="h6" gutterBottom>
//                       <strong>{user.name}</strong>
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 0.5 }}>
//                       <strong>Role:</strong> {user.role || 'Unknown'}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 0.5 }}>
//                       <strong>Email:</strong> {user.email || 'Not Provided'}
//                     </Typography>
//                     <Typography variant="body2">
//                       <strong>Bio:</strong> {user.bio || 'No bio available.'}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Box>
//             ))}
//           </Slider>
//         </Box>
//       )}
//     </Box>
//   );

//   return (
//     <>
//       {renderUsers(teamMembers, 'Our Team')}
//       {renderUsers(alumniMembers, 'Our Alumni')}
//     </>
//   );
// };

// export default TeamSection;

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Skeleton
} from '@mui/material';
import Slider from 'react-slick';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';

const TeamSection = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [alumniMembers, setAlumniMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch team data first
        const teamRes = await axiosInstance.get(`${API_BASE_URL}/api/team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const teamMembers = teamRes.data;

        // Map userId to fetch user data for each team member
        const userDetails = await Promise.all(
          teamMembers.map(async (teamMember) => {
            const userRes = await axiosInstance.get(`${API_BASE_URL}/api/user/${teamMember.userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return {
              ...userRes.data,
              isAlumni: teamMember.isAlumni, // Include alumni status from team data
            };
          })
        );

        // Separate users into team members and alumni
        setTeamMembers(userDetails.filter((user) => !user.isAlumni));
        setAlumniMembers(userDetails.filter((user) => user.isAlumni));
      } catch (error) {
        console.error('Failed to fetch team data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  const renderUsers = (users, title) => {
    const slidesToShow = users.length < 2 ? 1 : 3;  // Show 1 slide if less than 2 users, otherwise 3

    const settings = {
      dots: true,
      infinite: users.length>1,
      speed: 1200,
      cssEase: 'ease-in-out',
      slidesToShow: slidesToShow,  // Set slidesToShow based on number of users
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 1000,
      arrows: true,
      responsive: [
        {
          breakpoint: 960,
          settings: {
            slidesToShow: slidesToShow < 2 ? 1 : 2,  // Dynamically adjust for responsiveness
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
      <Box sx={{ py: 5 , px: 3}}>
        <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
          {title}
        </Typography>

        {loading ? (
                <Grid container spacing={3}>
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Grid item xs={12} sm={12} md={4} key={index}>
                      <Skeleton variant="rectangular" width="100%" height={250} />
                    </Grid>
                  ))}
                </Grid>
              )  : (
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '90%', md: '80%' },
              margin: '0 auto',
            }}
          >
            <Slider {...settings}>
              {users.map((user) => (
                <Box key={user._id} sx={{ p: 1 }}>
                  <Card
                    sx={{
                      borderRadius: '1rem',
                      background:
                        'linear-gradient(45deg, #e53238 0%, #f5af02 25%, #86b817 50%, #0064d2 75%)',
                      color: '#ffffff',
                      overflow: 'hidden',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 3,
                        pb: 1,
                      }}
                    >
                      <Avatar
                        component={Link}
                        to={`/users/${user._id}`}
                        sx={{ width: 120, height: 120 }}
                        src={`${API_BASE_URL}/${user.image || 'default-avatar.jpg'}`}
                        alt={user.name}
                      />
                    </Box>

                    <CardContent
                      sx={{
                        backgroundColor: '#fff',
                        color: '#333',
                        textAlign: 'center',
                        pt: 0,
                      }}
                    >
                      <Typography variant="h6" gutterBottom>
                        <strong>{user.name}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Role:</strong> {user.role || 'Unknown'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Email:</strong> {user.email || 'Not Provided'}
                      </Typography>
                      {/* <Typography variant="body2">
                        <strong>Bio:</strong> {user.bio || 'No bio available.'}
                      </Typography> */}
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      {renderUsers(teamMembers, 'Our Team')}
      {renderUsers(alumniMembers, 'Our Alumni')}
    </>
  );
};

export default TeamSection;
