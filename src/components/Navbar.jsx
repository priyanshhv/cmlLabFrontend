
// // export default Navbar;

// import React, { useState } from 'react';
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemText,
//   Typography,
//   Box
// } from '@mui/material';
// import { Menu as MenuIcon } from '@mui/icons-material';
// import { useSelector, useDispatch } from 'react-redux';
// import { logout } from '../redux/userSlice';

// const Navbar = () => {
//   const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
//   const dispatch = useDispatch();
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   const handleLogout = () => {
//     dispatch(logout());
//     localStorage.removeItem('token');
//     window.location.href = '/';
//   };

//   // Configure your links
//   const links = [
//     { label: 'Home', path: '/' },
//     ...(isLoggedIn
//       ? [
//           { label: 'Users', path: '/users' },
//           { label: 'Add Publication', path: '/add-publication' },
//           { label: 'Logout', action: handleLogout },
//         ]
//       : [
//           { label: 'Login', path: '/login' },
//           { label: 'Register', path: '/register' },
//         ]),
//   ];

//   return (
//     <>
//       <AppBar
//         position="sticky"
//         sx={{
//           // Vibrant gradient background
//           background: 'linear-gradient(to right, #3f51b5, #283593)',
//           // Remove default shadow; add custom transition
//           boxShadow: 'none',
//           transition: 'box-shadow 0.3s ease',
//           // On hover, give a bit more shadow for a subtle "pop"
//           '&:hover': {
//             boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
//           },
//         }}
//       >
//         <Toolbar
//           sx={{
//             // Spacing for brand area
//             px: { xs: 2, sm: 3, md: 4 },
//           }}
//         >
//           {/* LOGO / BRAND */}
//           <Typography
//             variant="h6"
//             component="div"
//             sx={{
//               flexGrow: 1,
//               display: 'flex',
//               alignItems: 'center',
//               fontWeight: 700,
//               letterSpacing: '0.5px',
//             }}
//           >
//             {/* 
//               If you have an actual logo image, you can use:
//               <Box
//                 component="img"
//                 src="/logo.png"
//                 alt="Logo"
//                 sx={{ height: 40, mr: 1 }}
//               />
//             */}
//             OurLab
//           </Typography>

//           {/* MOBILE MENU ICON */}
//           <IconButton
//             color="inherit"
//             edge="start"
//             sx={{
//               display: { xs: 'block', md: 'none' },
//             }}
//             onClick={() => setDrawerOpen(true)}
//           >
//             <MenuIcon />
//           </IconButton>

//           {/* DESKTOP LINKS */}
//           <Box
//             sx={{
//               display: { xs: 'none', md: 'flex' },
//               // Animate links on hover
//               '& button': {
//                 transition: 'transform 0.2s ease',
//               },
//               '& button:hover': {
//                 transform: 'scale(1.05)',
//                 backgroundColor: 'rgba(255, 255, 255, 0.1)',
//               },
//             }}
//           >
//             {links.map((link, idx) =>
//               link.action ? (
//                 <Button key={idx} color="inherit" onClick={link.action}>
//                   {link.label}
//                 </Button>
//               ) : (
//                 <Button key={idx} color="inherit" href={link.path}>
//                   {link.label}
//                 </Button>
//               )
//             )}
//           </Box>
//         </Toolbar>
//       </AppBar>

//       {/* MOBILE DRAWER */}
//       <Drawer
//         anchor="left"
//         open={drawerOpen}
//         onClose={() => setDrawerOpen(false)}
//         // Optionally style the Drawer background
//         PaperProps={{
//           sx: {
//             background: 'linear-gradient(to bottom, #3f51b5, #283593)',
//             color: '#fff',
//           },
//         }}
//       >
//         <List sx={{ width: 250 }}>
//           {links.map((link, idx) => (
//             <ListItem
//               button
//               key={idx}
//               onClick={() => {
//                 setDrawerOpen(false);
//                 link.action ? link.action() : (window.location.href = link.path);
//               }}
//               sx={{
//                 // Hover effect for mobile nav items
//                 transition: 'background 0.2s ease',
//                 '&:hover': {
//                   backgroundColor: 'rgba(255, 255, 255, 0.2)',
//                 },
//               }}
//             >
//               <ListItemText primary={link.label} />
//             </ListItem>
//           ))}
//         </List>
//       </Drawer>
//     </>
//   );
// };

// export default Navbar;

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Navbar = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Common links for all users
  const commonLinks = [{ label: 'Home', path: '/' }];

  // Auth-specific links for LOGGED-IN users
  const loggedInLinks = [
    { label: 'Users', path: '/users' },
    { label: 'Add Publication', path: '/add-publication' },
    {
      label: 'Logout',
      action: handleLogout,
      // We'll style "Logout" differently
      logout: true,
    },
  ];

  // Auth-specific links for LOGGED-OUT users
  const loggedOutLinks = [
    {
      label: 'Login',
      path: '/login',
      variant: 'outlined', // We'll make it an outlined button
    },
    {
      label: 'Register',
      path: '/register',
      variant: 'contained', // We'll make it a contained (filled) button
      color: 'secondary',   // or pick any other color variant
    },
  ];

  // Merge arrays depending on auth status
  const links = isLoggedIn
    ? [...commonLinks, ...loggedInLinks]
    : [...commonLinks, ...loggedOutLinks];

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: 'linear-gradient(to right, #3f51b5, #283593)',
          boxShadow: 'none',
          transition: 'box-shadow 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          },
        }}
      >
        <Toolbar
          sx={{
            px: { xs: 2, sm: 3, md: 4 },
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* LOGO / BRAND */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {/* If you have a real logo image, replace with an <img> */}
            OurLab
          </Typography>

          {/* MOBILE MENU ICON */}
          <IconButton
            color="inherit"
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>

          {/* DESKTOP LINKS */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1.5, // spacing between buttons
              '& a, & button': {
                transition: 'transform 0.2s ease, background-color 0.2s ease',
              },
              // Scale and slight background highlight on hover
              '& a:hover, & button:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {links.map((link, idx) => {
              // If it's a logout link
              if (link.logout) {
                return (
                  <Button
                    key={idx}
                    color="error"
                    variant="outlined"
                    onClick={link.action}
                    sx={{
                      borderColor: '#ff5252',
                      '&:hover': {
                        // More pronounced effect for logout
                        backgroundColor: 'rgba(255, 82, 82, 0.1)',
                      },
                    }}
                  >
                    {link.label}
                  </Button>
                );
              }

              // If it has a variant (Login / Register)
              if (link.variant) {
                return (
                  <Button
                    key={idx}
                    variant={link.variant} // e.g. "outlined" or "contained"
                    color={link.color || 'inherit'}
                    href={link.path}
                  >
                    {link.label}
                  </Button>
                );
              }

              // Otherwise (normal link)
              if (link.action) {
                return (
                  <Button key={idx} color="inherit" onClick={link.action}>
                    {link.label}
                  </Button>
                );
              }
              return (
                <Button key={idx} color="inherit" href={link.path}>
                  {link.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(to bottom, #3f51b5, #283593)',
            color: '#fff',
          },
        }}
      >
        <List sx={{ width: 250 }}>
          {links.map((link, idx) => (
            <ListItem
              button
              key={idx}
              onClick={() => {
                setDrawerOpen(false);
                link.action
                  ? link.action()
                  : (window.location.href = link.path);
              }}
              sx={{
                transition: 'background 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <ListItemText
                primary={
                  link.label === 'Logout'
                    ? // Emphasize logout with a different color in the list
                      <span style={{ color: '#ff5252' }}>{link.label}</span>
                    : link.label
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
