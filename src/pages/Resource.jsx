// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Box,
//   Grid,
//   Container,
//   Button,
//   useMediaQuery,
//   Snackbar,
//   Collapse,
//   IconButton,
//   CircularProgress
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import { useTheme } from '@mui/material/styles';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';
// import { useSnackbar } from 'notistack';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Alert from '@mui/material/Alert';

// const useStyles = makeStyles((theme) => ({
//   mainContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//     padding: theme.spacing(4),
//     backgroundColor: theme.palette.background.default,
//     fontFamily: `'Roboto', sans-serif`,
//   },
//   titleContainer: {
//     marginBottom: theme.spacing(4),
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: '3rem',
//     fontWeight: 700,
//     color: theme.palette.primary.main,
//   },
//   subtitle: {
//     fontSize: '1rem',
//     color: theme.palette.text.secondary,
//     marginBottom: theme.spacing(2),
//   },
//   sectionTitle: {
//     fontSize: '1.5rem',
//     fontWeight: 600,
//     marginBottom: theme.spacing(3),
//     textAlign: 'center',
//   },
//   itemContainer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(2),
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     marginBottom: theme.spacing(3),
//     transition: 'transform 0.3s ease-in-out',
//     '&:hover': {
//       transform: 'scale(1.05)',
//     },
//   },
//   techName: {
//     fontWeight: 600,
//     marginBottom: theme.spacing(1),
//     color: theme.palette.primary.main,
//     textAlign: 'left',
//   },
//   techImage: {
//     width: '40px',
//     height: '40px',
//     borderRadius: '50%',
//     marginRight: theme.spacing(2),
//   },
//   expandIcon: {
//     color: theme.palette.primary.main,
//   },
//   collapseContent: {
//     padding: theme.spacing(2),
//     marginTop: theme.spacing(1),
//   },
//   button: {
//     marginTop: theme.spacing(1),
//     padding: theme.spacing(1.5, 3),
//     borderRadius: '5px',
//     backgroundColor: theme.palette.primary.main,
//     color: '#fff',
//     '&:hover': {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   },
//   spinnerContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '50vh',
//   },
// }));

// const ResourcePage = () => {
//   const classes = useStyles();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { enqueueSnackbar } = useSnackbar();

//   // States for each resource collection
//   const [technologies, setTechnologies] = useState([]);
//   const [tutorials, setTutorials] = useState([]);
//   const [notes, setNotes] = useState([]);

//   const [error, setError] = useState(null);
//   const [expandedTech, setExpandedTech] = useState(null);
//   const [expandedTut, setExpandedTut] = useState(null);
//   const [expandedNote, setExpandedNote] = useState(null);

//   const [loading, setLoading] = useState(true);

//   // Fetch all three resources: technology, tutorial, notes
//   useEffect(() => {
//     const fetchResources = async () => {
//       setLoading(true);
//       try {
//         // Triple fetch in parallel
//         const [techRes, tutRes, notesRes] = await Promise.all([
//           axiosInstance.get(`${API_BASE_URL}/api/technology`),
//           axiosInstance.get(`${API_BASE_URL}/api/tutorial`),
//           axiosInstance.get(`${API_BASE_URL}/api/notes`),
//         ]);
//         setTechnologies(techRes.data);
//         setTutorials(tutRes.data);
//         setNotes(notesRes.data);
//       } catch (error) {
//         setError(error);
//         enqueueSnackbar('Failed to fetch resources', { variant: 'error' });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResources();
//   }, [enqueueSnackbar]);

//   // Handle collapsible panel toggling
//   const handleExpandClick = (id, type) => {
//     if (type === 'tech') {
//       setExpandedTech(expandedTech === id ? null : id);
//     } else if (type === 'tutorial') {
//       setExpandedTut(expandedTut === id ? null : id);
//     } else if (type === 'notes') {
//       setExpandedNote(expandedNote === id ? null : id);
//     }
//   };

//   // Show spinner if still loading
//   if (loading) {
//     return (
//       <Container maxWidth="lg" className={classes.mainContainer}>
//         <Box className={classes.spinnerContainer}>
//           <CircularProgress size={60} />
//         </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" className={classes.mainContainer}>
//       <Box className={classes.titleContainer}>
//         <Typography className={classes.title}>Explore Our Resources</Typography>
//         <Typography className={classes.subtitle}>
//           Discover resources, technologies, tutorials, and notes curated just for you
//         </Typography>
//       </Box>

//       {/* Error Snackbar (if any) */}
//       {error && (
//         <Snackbar
//           open={!!error}
//           autoHideDuration={6000}
//           onClose={() => setError(null)}
//         >
//           <Alert onClose={() => setError(null)} severity="error">
//             An error occurred while fetching resources: {error.message}
//           </Alert>
//         </Snackbar>
//       )}

//       {/* Technologies Section */}
//       {technologies.length > 0 && (
//         <Box sx={{ mb: 6 }}> {/* Added margin-bottom for spacing between sections */}
//           <Typography className={classes.sectionTitle}>Technologies</Typography>
//           <Grid container spacing={4} justifyContent="center">
//             {technologies.map((tech) => (
//               <Grid item xs={12} sm={6} md={4} key={tech._id}>
//                 <div className={classes.itemContainer}>
//                   <Box display="flex" alignItems="center">
//                     <img
//                       className={classes.techImage}
//                       src={tech.icon}
//                       alt={tech.name}
//                     />
//                     <Typography variant="h6" className={classes.techName}>
//                       {tech.name}
//                     </Typography>
//                     <IconButton
//                       className={classes.expandIcon}
//                       onClick={() => handleExpandClick(tech._id, 'tech')}
//                     >
//                       <ExpandMoreIcon />
//                     </IconButton>
//                   </Box>
//                   <Collapse in={expandedTech === tech._id}>
//                     <Box className={classes.collapseContent}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         {tech.description}
//                       </Typography>
//                       {tech.downloadLink && (
//                         <Button
//                           variant="contained"
//                           href={tech.downloadLink}
//                           target="_blank"
//                           className={classes.button}
//                         >
//                           Download
//                         </Button>
//                       )}
//                     </Box>
//                   </Collapse>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {/* Tutorials Section */}
//       {tutorials.length > 0 && (
//         <Box sx={{ mb: 6 }}> {/* Added margin-bottom for spacing between sections */}
//           <Typography className={classes.sectionTitle}>Tutorials</Typography>
//           <Grid container spacing={4} justifyContent="center">
//             {tutorials.map((tutorial) => (
//               <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
//                 <div className={classes.itemContainer}>
//                   <Box display="flex" alignItems="center">
//                     <img
//                       className={classes.techImage}
//                       src={tutorial.newIcon}
//                       alt={tutorial.name}
//                     />
//                     <Typography variant="h6" className={classes.techName}>
//                       {tutorial.name}
//                     </Typography>
//                     <IconButton
//                       className={classes.expandIcon}
//                       onClick={() => handleExpandClick(tutorial._id, 'tutorial')}
//                     >
//                       <ExpandMoreIcon />
//                     </IconButton>
//                   </Box>
//                   <Collapse in={expandedTut === tutorial._id}>
//                     <Box className={classes.collapseContent}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         {tutorial.description}
//                       </Typography>
//                       {tutorial.tutorialLink && (
//                         <Button
//                           variant="contained"
//                           href={tutorial.tutorialLink}
//                           target="_blank"
//                           className={classes.button}
//                         >
//                           View Tutorial
//                         </Button>
//                       )}
//                     </Box>
//                   </Collapse>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {/* Notes Section */}
//       {notes.length > 0 && (
//         <Box>
//           <Typography className={classes.sectionTitle}>Notes</Typography>
//           <Grid container spacing={4} justifyContent="center">
//             {notes.map((note) => (
//               <Grid item xs={12} sm={6} md={4} key={note._id}>
//                 <div className={classes.itemContainer}>
//                   <Box display="flex" alignItems="center">
//                     <img
//                       className={classes.techImage}
//                       src={note.newIcon}
//                       alt={note.name}
//                     />
//                     <Typography variant="h6" className={classes.techName}>
//                       {note.name}
//                     </Typography>
//                     <IconButton
//                       className={classes.expandIcon}
//                       onClick={() => handleExpandClick(note._id, 'notes')}
//                     >
//                       <ExpandMoreIcon />
//                     </IconButton>
//                   </Box>
//                   <Collapse in={expandedNote === note._id}>
//                     <Box className={classes.collapseContent}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>
//                         {note.description}
//                       </Typography>
//                       {note.noteLink && (
//                         <Button
//                           variant="contained"
//                           href={note.noteLink}
//                           target="_blank"
//                           className={classes.button}
//                         >
//                           View Note
//                         </Button>
//                       )}
//                     </Box>
//                   </Collapse>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {/* Message if no resources are available after loading */}
//       {!loading && technologies.length === 0 && tutorials.length === 0 && notes.length === 0 && (
//         <Box sx={{ textAlign: 'center', mt: 4 }}>
//           <Typography variant="h6" color="textSecondary">
//             No resources are available at the moment. Please check back later!
//           </Typography>
//         </Box>
//       )}
//     </Container>
//   );
// };

// export default ResourcePage;

// import React, { useState, useEffect, useCallback } from 'react'; // MODIFIED: Added useCallback
// import {
//   Typography,
//   Box,
//   Grid,
//   Container,
//   Button,
//   useMediaQuery,
//   Snackbar,
//   Collapse,
//   IconButton,
//   CircularProgress,
//   // NEW: Import Dialog components
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogContentText,
//   DialogTitle,
// } from '@mui/material';
// import { makeStyles } from '@mui/styles';
// import { useTheme } from '@mui/material/styles';
// import axiosInstance from '../axiosInstance';
// import { API_BASE_URL } from '../config';
// import { useSnackbar } from 'notistack';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import DeleteIcon from '@mui/icons-material/Delete'; // NEW: Icon for delete button
// import Alert from '@mui/material/Alert';

// const useStyles = makeStyles((theme) => ({
//     // ... (Your existing styles remain unchanged)
//   mainContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     minHeight: '100vh',
//     padding: theme.spacing(4),
//     backgroundColor: theme.palette.background.default,
//     fontFamily: `'Roboto', sans-serif`,
//   },
//   titleContainer: {
//     marginBottom: theme.spacing(4),
//     textAlign: 'center',
//   },
//   title: {
//     fontSize: '3rem',
//     fontWeight: 700,
//     color: theme.palette.primary.main,
//   },
//   subtitle: {
//     fontSize: '1rem',
//     color: theme.palette.text.secondary,
//     marginBottom: theme.spacing(2),
//   },
//   sectionTitle: {
//     fontSize: '1.5rem',
//     fontWeight: 600,
//     marginBottom: theme.spacing(3),
//     textAlign: 'center',
//   },
//   itemContainer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing(2),
//     borderRadius: '8px',
//     boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//     marginBottom: theme.spacing(3),
//     transition: 'transform 0.3s ease-in-out',
//     '&:hover': {
//       transform: 'scale(1.05)',
//     },
//   },
//   techName: {
//     fontWeight: 600,
//     marginBottom: theme.spacing(1),
//     color: theme.palette.primary.main,
//     textAlign: 'left',
//   },
//   techImage: {
//     width: '40px',
//     height: '40px',
//     borderRadius: '50%',
//     marginRight: theme.spacing(2),
//   },
//   expandIcon: {
//     color: theme.palette.primary.main,
//   },
//   collapseContent: {
//     padding: theme.spacing(2),
//     marginTop: theme.spacing(1),
//   },
//   button: {
//     marginTop: theme.spacing(1),
//     padding: theme.spacing(1.5, 3),
//     borderRadius: '5px',
//     backgroundColor: theme.palette.primary.main,
//     color: '#fff',
//     '&:hover': {
//       backgroundColor: theme.palette.primary.dark,
//     },
//   },
//   spinnerContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: '50vh',
//   },
// }));

// const ResourcePage = () => {
//   const classes = useStyles();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const { enqueueSnackbar } = useSnackbar();

//   const [technologies, setTechnologies] = useState([]);
//   const [tutorials, setTutorials] = useState([]);
//   const [notes, setNotes] = useState([]);
//   const [error, setError] = useState(null);
//   const [expandedTech, setExpandedTech] = useState(null);
//   const [expandedTut, setExpandedTut] = useState(null);
//   const [expandedNote, setExpandedNote] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // NEW: State for admin status and delete confirmation
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null); // Will hold { id, type }

//   // Fetch all resources and check admin status
//   useEffect(() => {
//     const fetchAllData = async () => {
//         setLoading(true);
//         try {
//             // Fetch all resources in parallel
//             const [techRes, tutRes, notesRes] = await Promise.all([
//                 axiosInstance.get(`${API_BASE_URL}/api/technology`),
//                 axiosInstance.get(`${API_BASE_URL}/api/tutorial`),
//                 axiosInstance.get(`${API_BASE_URL}/api/notes`),
//             ]);
//             setTechnologies(techRes.data);
//             setTutorials(tutRes.data);
//             setNotes(notesRes.data);

//             // Check for admin status
//             const token = localStorage.getItem('token');
//             if (token) {
//                 const adminResponse = await axiosInstance.get(`${API_BASE_URL}/api/isAdmin`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setIsAdmin(adminResponse.data.isAdmin);
//             } else {
//                 setIsAdmin(false);
//             }
//         } catch (err) {
//             setError(err);
//             enqueueSnackbar('Failed to fetch data', { variant: 'error' });
//             setIsAdmin(false); // Assume not admin on error
//         } finally {
//             setLoading(false);
//         }
//     };

//     fetchAllData();
// }, [enqueueSnackbar]);


//   const handleExpandClick = (id, type) => {
//     if (type === 'tech') setExpandedTech(expandedTech === id ? null : id);
//     else if (type === 'tutorial') setExpandedTut(expandedTut === id ? null : id);
//     else if (type === 'notes') setExpandedNote(expandedNote === id ? null : id);
//   };

//   // NEW: Handlers for the delete process
//   const handleDeleteClick = useCallback((id, type) => {
//     setItemToDelete({ id, type });
//     setOpenDialog(true);
//   }, []);

//   const handleCloseDialog = useCallback(() => {
//     setOpenDialog(false);
//     setItemToDelete(null);
//   }, []);

//   const handleConfirmDelete = useCallback(async () => {
//     if (!itemToDelete) return;

//     const { id, type } = itemToDelete;
//     const token = localStorage.getItem('token');
//     let url = '';
    
//     // Determine the correct API endpoint
//     switch (type) {
//       case 'technology':
//         url = `${API_BASE_URL}/api/technology/${id}`;
//         break;
//       case 'tutorial':
//         url = `${API_BASE_URL}/api/tutorial/${id}`;
//         break;
//       case 'notes':
//         url = `${API_BASE_URL}/api/notes/${id}`;
//         break;
//       default:
//         enqueueSnackbar('Invalid resource type for deletion', { variant: 'error' });
//         return;
//     }

//     try {
//       await axiosInstance.delete(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Remove the item from the local state to update the UI
//       if (type === 'technology') {
//         setTechnologies((prev) => prev.filter((item) => item._id !== id));
//       } else if (type === 'tutorial') {
//         setTutorials((prev) => prev.filter((item) => item._id !== id));
//       } else if (type === 'notes') {
//         setNotes((prev) => prev.filter((item) => item._id !== id));
//       }

//       enqueueSnackbar('Resource deleted successfully!', { variant: 'success' });
//     } catch (error) {
//       console.error('Error deleting resource:', error);
//       enqueueSnackbar('Failed to delete resource.', { variant: 'error' });
//     } finally {
//       handleCloseDialog();
//     }
//   }, [itemToDelete, enqueueSnackbar, handleCloseDialog]);


//   if (loading) {
//     return (
//       <Container maxWidth="lg" className={classes.mainContainer}>
//         <Box className={classes.spinnerContainer}> <CircularProgress size={60} /> </Box>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="lg" className={classes.mainContainer}>
//       <Box className={classes.titleContainer}>
//         <Typography className={classes.title}>Explore Our Resources</Typography>
//         <Typography className={classes.subtitle}>Discover technologies, tutorials, and teaching materials curated just for you</Typography>
//       </Box>

//       {/* Technologies Section */}
//       {technologies.length > 0 && (
//         <Box sx={{ mb: 6 }}>
//           <Typography className={classes.sectionTitle}>Technologies</Typography>
//           <Grid container spacing={4} justifyContent="center">
//             {technologies.map((tech) => (
//               <Grid item xs={12} sm={6} md={4} key={tech._id}>
//                 <div className={classes.itemContainer}>
//                   <Box display="flex" alignItems="center">
//                     {/* ... tech info ... */}
//                       <img className={classes.techImage} src={tech.icon} alt={tech.name}/>
//                       <Typography variant="h6" className={classes.techName}>{tech.name}</Typography>
//                       <IconButton className={classes.expandIcon} onClick={() => handleExpandClick(tech._id, 'tech')}><ExpandMoreIcon /></IconButton>
//                   </Box>
//                   <Collapse in={expandedTech === tech._id}>
//                     <Box className={classes.collapseContent}>
//                       <Typography variant="body2" color="textSecondary" gutterBottom>{tech.description}</Typography>
//                         {/* MODIFIED: Button container with conditional delete button */}
//                         <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
//                           {tech.downloadLink && (
//                             <Button variant="contained" href={tech.downloadLink} target="_blank" className={classes.button}>Download</Button>
//                           )}
//                           {isAdmin && (
//                             <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(tech._id, 'technology')}>Delete</Button>
//                           )}
//                         </Box>
//                     </Box>
//                   </Collapse>
//                 </div>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {/* Tutorials Section */}
//       {tutorials.length > 0 && (
//         <Box sx={{ mb: 6 }}>
//         <Typography className={classes.sectionTitle}>Tutorials</Typography>
//         <Grid container spacing={4} justifyContent="center">
//             {tutorials.map((tutorial) => (
//                 <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
//                     <div className={classes.itemContainer}>
//                         <Box display="flex" alignItems="center">
//                             {/* ... tutorial info ... */}
//                             <img className={classes.techImage} src={tutorial.newIcon} alt={tutorial.name} />
//                             <Typography variant="h6" className={classes.techName}>{tutorial.name}</Typography>
//                             <IconButton className={classes.expandIcon} onClick={() => handleExpandClick(tutorial._id, 'tutorial')}><ExpandMoreIcon /></IconButton>
//                         </Box>
//                         <Collapse in={expandedTut === tutorial._id}>
//                             <Box className={classes.collapseContent}>
//                                 <Typography variant="body2" color="textSecondary" gutterBottom>{tutorial.description}</Typography>
//                                 {/* MODIFIED: Button container with conditional delete button */}
//                                 <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
//                                   {tutorial.tutorialLink && (
//                                     <Button variant="contained" href={tutorial.tutorialLink} target="_blank" className={classes.button}>View Tutorial</Button>
//                                   )}
//                                   {isAdmin && (
//                                     <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(tutorial._id, 'tutorial')}>Delete</Button>
//                                   )}
//                                 </Box>
//                             </Box>
//                         </Collapse>
//                     </div>
//                 </Grid>
//             ))}
//         </Grid>
//     </Box>
//       )}

//       {/* Notes Section */}
//       {notes.length > 0 && (
//         <Box>
//         <Typography className={classes.sectionTitle}>Teaching</Typography>
//         <Grid container spacing={4} justifyContent="center">
//             {notes.map((note) => (
//                 <Grid item xs={12} sm={6} md={4} key={note._id}>
//                     <div className={classes.itemContainer}>
//                         <Box display="flex" alignItems="center">
//                             {/* ... note info ... */}
//                             <img className={classes.techImage} src={note.newIcon} alt={note.name} />
//                             <Typography variant="h6" className={classes.techName}>{note.name}</Typography>
//                             <IconButton className={classes.expandIcon} onClick={() => handleExpandClick(note._id, 'notes')}><ExpandMoreIcon /></IconButton>
//                         </Box>
//                         <Collapse in={expandedNote === note._id}>
//                             <Box className={classes.collapseContent}>
//                                 <Typography variant="body2" color="textSecondary" gutterBottom>{note.description}</Typography>
//                                 {/* MODIFIED: Button container with conditional delete button */}
//                                 <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
//                                   {note.noteLink && (
//                                     <Button variant="contained" href={note.noteLink} target="_blank" className={classes.button}>View Note</Button>
//                                   )}
//                                   {isAdmin && (
//                                     <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteClick(note._id, 'notes')}>Delete</Button>
//                                   )}
//                                 </Box>
//                             </Box>
//                         </Collapse>
//                     </div>
//                 </Grid>
//             ))}
//         </Grid>
//     </Box>
//       )}

//       {/* ... no resources message ... */}

//       {/* NEW: Delete Confirmation Dialog */}
//       <Dialog
//         open={openDialog}
//         onClose={handleCloseDialog}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="alert-dialog-description">
//             Are you sure you want to delete this resource? This action cannot be undone.
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
//           <Button onClick={handleConfirmDelete} color="error" autoFocus>Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default ResourcePage;

import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Grid,
  Container,
  Button,
  Collapse,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
} from '@mui/material';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { useSnackbar } from 'notistack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

// A functional component for rendering each resource section
const ResourceSection = ({ title, items, expandedId, onExpand, onDelete, isAdmin, type }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h4" component="h2" sx={{ textAlign: 'center', mb: 3, fontWeight: '600' }}>
        {title}
      </Typography>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  cursor: 'pointer',
                }}
                onClick={() => onExpand(item._id, type)}
              >
                <Box
                  component="img"
                  src={item.icon || item.newIcon || 'https://placehold.co/40x40'}
                  alt={`${item.name} icon`}
                  sx={{
                    width: 40,
                    height: 40,
                    mr: 2,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '500' }}>
                  {item.name}
                </Typography>
                <IconButton
                  sx={{
                    transform: expandedId === item._id ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Collapse in={expandedId === item._id} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    {item.downloadLink && (
                      <Button variant="contained" href={item.downloadLink} target="_blank" rel="noopener noreferrer">
                        Download
                      </Button>
                    )}
                    {item.tutorialLink && (
                      <Button variant="contained" href={item.tutorialLink} target="_blank" rel="noopener noreferrer">
                        View Tutorial
                      </Button>
                    )}
                    {item.noteLink && (
                      <Button variant="contained" href={item.noteLink} target="_blank" rel="noopener noreferrer">
                        View Note
                      </Button>
                    )}
                    {isAdmin && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => onDelete(item._id, type)}
                      >
                        Delete
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};


const ResourcePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // State for expansion and deletion
  const [expanded, setExpanded] = useState({}); // e.g., { technology: 'id1', tutorial: 'id2' }
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch all data and admin status on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [techRes, tutRes, notesRes] = await Promise.all([
          axiosInstance.get(`${API_BASE_URL}/api/technology`),
          axiosInstance.get(`${API_BASE_URL}/api/tutorial`),
          axiosInstance.get(`${API_BASE_URL}/api/notes`),
        ]);
        setTechnologies(techRes.data);
        setTutorials(tutRes.data);
        setNotes(notesRes.data);

        const token = localStorage.getItem('token');
        if (token) {
          const adminResponse = await axiosInstance.get(`${API_BASE_URL}/api/isAdmin`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsAdmin(adminResponse.data.isAdmin);
        }
      } catch (err) {
        console.error("Failed to fetch resources:", err);
        enqueueSnackbar('Failed to fetch resources', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [enqueueSnackbar]);

  const handleExpandClick = useCallback((id, type) => {
    setExpanded(prev => ({
      ...prev,
      [type]: prev[type] === id ? null : id,
    }));
  }, []);

  const handleDeleteClick = useCallback((id, type) => {
    setItemToDelete({ id, type });
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setItemToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    const { id, type } = itemToDelete;
    const token = localStorage.getItem('token');
    
    try {
      await axiosInstance.delete(`${API_BASE_URL}/api/${type}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state based on the type of item deleted
      const stateUpdater = {
        technology: setTechnologies,
        tutorial: setTutorials,
        notes: setNotes,
      };
      stateUpdater[type]((prev) => prev.filter((item) => item._id !== id));
      
      enqueueSnackbar('Resource deleted successfully!', { variant: 'success' });
    } catch (error) {
      console.error('Error deleting resource:', error);
      enqueueSnackbar('Failed to delete resource. Please try again.', { variant: 'error' });
    } finally {
      handleCloseDialog();
    }
  }, [itemToDelete, enqueueSnackbar, handleCloseDialog]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ textAlign: 'center', mb: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Explore Our Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '600px', mx: 'auto' }}>
          Discover technologies, tutorials, and teaching materials curated just for you.
        </Typography>
      </Box>

      <ResourceSection
        title="Technologies"
        items={technologies}
        expandedId={expanded.technology}
        onExpand={handleExpandClick}
        onDelete={handleDeleteClick}
        isAdmin={isAdmin}
        type="technology"
      />

      <ResourceSection
        title="Tutorials"
        items={tutorials}
        expandedId={expanded.tutorial}
        onExpand={handleExpandClick}
        onDelete={handleDeleteClick}
        isAdmin={isAdmin}
        type="tutorial"
      />
      
      <ResourceSection
        title="Teaching Notes"
        items={notes}
        expandedId={expanded.notes}
        onExpand={handleExpandClick}
        onDelete={handleDeleteClick}
        isAdmin={isAdmin}
        type="notes"
      />

      {!loading && !technologies.length && !tutorials.length && !notes.length && (
        <Typography sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
          No resources are available at the moment. Please check back later!
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle fontWeight="bold">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this resource? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ResourcePage;
