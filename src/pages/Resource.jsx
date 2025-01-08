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
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import axiosInstance from '../axiosInstance';
import { API_BASE_URL } from '../config';
import { useSnackbar } from 'notistack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
}));

const ResourcePage = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [resourceText, setResourceText] = useState('');
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [error, setError] = useState(null);
  const [expandedTech, setExpandedTech] = useState(null);
  const [expandedTut, setExpandedTut] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [ techRes, tutRes] = await Promise.all([
        
          axiosInstance.get(`${API_BASE_URL}/api/technology`),
          axiosInstance.get(`${API_BASE_URL}/api/tutorial`),
        ]);
        
        setTechnologies(techRes.data);
        setTutorials(tutRes.data);
      } catch (error) {
        setError(error);
        enqueueSnackbar('Failed to fetch resources', { variant: 'error' });
      }
    };

    fetchResources();
  }, [enqueueSnackbar]);

  const handleExpandClick = (id, type) => {
    if (type === 'tech') {
      setExpandedTech(expandedTech === id ? null : id);
    } else {
      setExpandedTut(expandedTut === id ? null : id);
    }
  };

  return (
    <Container maxWidth="lg" className={classes.mainContainer}>
      <Box className={classes.titleContainer}>
        <Typography className={classes.title}>Explore Our Resources</Typography>
        <Typography className={classes.subtitle}>
          Discover resources, technologies, and tutorials curated just for you
        </Typography>
      </Box>

      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert onClose={() => setError(null)} severity="error">
            An error occurred while fetching resources: {error.message}
          </Alert>
        </Snackbar>
      )}

      <Box>
        <Typography className={classes.sectionTitle}>Technologies</Typography>
        <Grid container spacing={4} justifyContent="center">
          {technologies.map((tech) => (
            <Grid item xs={12} sm={6} md={4} key={tech._id}>
              <div className={classes.itemContainer}>
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.techImage}
                    src={`${API_BASE_URL}/${tech.icon.replace(/\\/g, '/')}`}
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
                    <Button
                      variant="contained"
                      href={tech.downloadLink}
                      target="_blank"
                      className={classes.button}
                    >
                      Download
                    </Button>
                  </Box>
                </Collapse>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography className={classes.sectionTitle}>Tutorials</Typography>
        <Grid container spacing={4} justifyContent="center">
          {tutorials.map((tutorial) => (
            <Grid item xs={12} sm={6} md={4} key={tutorial._id}>
              <div className={classes.itemContainer}>
                <Box display="flex" alignItems="center">
                  <img
                    className={classes.techImage}
                    src={`${API_BASE_URL}/${tutorial.newIcon.replace(/\\/g, '/')}`}
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
                    <Button
                      variant="contained"
                      href={tutorial.tutorialLink}
                      target="_blank"
                      className={classes.button}
                    >
                      View Tutorial
                    </Button>
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
