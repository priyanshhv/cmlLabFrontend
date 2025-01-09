import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Container,
  Button,
  useMediaQuery,
  Snackbar,
  Collapse,
  IconButton,
  CircularProgress
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { useSnackbar } from 'notistack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// Make sure to import Alert from MUI
import Alert from '@mui/material/Alert';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    fontFamily: `'Roboto', sans-serif`,
  },
  titleContainer: {
    marginBottom: theme.spacing(4),
    textAlign: 'center',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 700,
    color: theme.palette.primary.main,
  },
  subtitle: {
    fontSize: '1rem',
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(3),
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  techName: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
    color: theme.palette.primary.main,
    textAlign: 'left',
  },
  techImage: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: theme.spacing(2),
  },
  expandIcon: {
    color: theme.palette.primary.main,
  },
  collapseContent: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1.5, 3),
    borderRadius: '5px',
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '50vh',
  },
}));

const ResourcePage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  // States for each resource collection
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [notes, setNotes] = useState([]);

  const [error, setError] = useState(null);
  const [expandedTech, setExpandedTech] = useState(null);
  const [expandedTut, setExpandedTut] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch all three resources: technology, tutorial, notes
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        // Triple fetch in parallel
        const [techRes, tutRes, notesRes] = await Promise.all([
          axiosInstance.get(`${API_BASE_URL}/api/technology`),
          axiosInstance.get(`${API_BASE_URL}/api/tutorial`),
          axiosInstance.get(`${API_BASE_URL}/api/notes`),
        ]);
        setTechnologies(techRes.data);
        setTutorials(tutRes.data);
        setNotes(notesRes.data);
      } catch (error) {
        setError(error);
        enqueueSnackbar('Failed to fetch resources', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [enqueueSnackbar]);

  // Handle collapsible panel toggling
  const handleExpandClick = (id, type) => {
    if (type === 'tech') {
      setExpandedTech(expandedTech === id ? null : id);
    } else if (type === 'tutorial') {
      setExpandedTut(expandedTut === id ? null : id);
    } else if (type === 'notes') {
      setExpandedNote(expandedNote === id ? null : id);
    }
  };

  // Show spinner if still loading
  if (loading) {
    return (
      <Container maxWidth="lg" className={classes.mainContainer}>
        <Box className={classes.spinnerContainer}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className={classes.mainContainer}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.title}>Explore Our Resources</Typography>
        <Typography className={classes.subtitle}>
          Discover resources, technologies, tutorials, and notes curated just for you
        </Typography>
      </Box>

      {/* Error Snackbar (if any) */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert onClose={() => setError(null)} severity="error">
            An error occurred while fetching resources: {error.message}
          </Alert>
        </Snackbar>
      )}

      {/* Technologies Section */}
      <Box>
        <Typography className={classes.sectionTitle}>Technologies</Typography>
        <Grid container spacing={4} justifyContent="center">
          {technologies.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech._id}>
              <div className={classes.itemContainer}>
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.techImage}
                    src={tech.icon}
                    alt={tech.name}
                  />
                  <Typography variant="h6" className={classes.techName}>
                    {tech.name}
                  </Typography>
                  <IconButton
                    className={classes.expandIcon}
                    onClick={() => handleExpandClick(tech._id, 'tech')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={expandedTech === tech._id}>
                  <Box className={classes.collapseContent}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {tech.description}
                    </Typography>
                    {tech.downloadLink && (
                      <Button
                        variant="contained"
                        href={tech.downloadLink}
                        target="_blank"
                        className={classes.button}
                      >
                        Download
                      </Button>
                    )}
                  </Box>
                </Collapse>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Tutorials Section */}
      <Box>
        <Typography className={classes.sectionTitle}>Tutorials</Typography>
        <Grid container spacing={4} justifyContent="center">
          {tutorials.map((tutorial) => (
            <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
              <div className={classes.itemContainer}>
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.techImage}
                    src={tutorial.newIcon}
                    alt={tutorial.name}
                  />
                  <Typography variant="h6" className={classes.techName}>
                    {tutorial.name}
                  </Typography>
                  <IconButton
                    className={classes.expandIcon}
                    onClick={() => handleExpandClick(tutorial._id, 'tutorial')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={expandedTut === tutorial._id}>
                  <Box className={classes.collapseContent}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {tutorial.description}
                    </Typography>
                    {tutorial.tutorialLink && (
                      <Button
                        variant="contained"
                        href={tutorial.tutorialLink}
                        target="_blank"
                        className={classes.button}
                      >
                        View Tutorial
                      </Button>
                    )}
                  </Box>
                </Collapse>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Notes Section */}
      <Box>
        <Typography className={classes.sectionTitle}>Notes</Typography>
        <Grid container spacing={4} justifyContent="center">
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note._id}>
              <div className={classes.itemContainer}>
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.techImage}
                    src={note.newIcon}
                    alt={note.name}
                  />
                  <Typography variant="h6" className={classes.techName}>
                    {note.name}
                  </Typography>
                  <IconButton
                    className={classes.expandIcon}
                    onClick={() => handleExpandClick(note._id, 'notes')}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                <Collapse in={expandedNote === note._id}>
                  <Box className={classes.collapseContent}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {note.description}
                    </Typography>
                    {note.noteLink && (
                      <Button
                        variant="contained"
                        href={note.noteLink}
                        target="_blank"
                        className={classes.button}
                      >
                        View Note
                      </Button>
                    )}
                  </Box>
                </Collapse>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default ResourcePage;
