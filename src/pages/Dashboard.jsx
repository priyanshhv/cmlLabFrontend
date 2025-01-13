import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Avatar,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SINGLE_DOC_CATEGORIES = ['address', 'about'];
const MULTI_DOC_CATEGORIES = ['role', 'technology', 'tutorial', 'notes'];

const CATEGORY_OPTIONS = [
  { value: 'address', label: 'Address' },
  { value: 'role', label: 'Role' },
  { value: 'about', label: 'About Section' },
  { value: 'technology', label: 'Technologies' },
  { value: 'tutorial', label: 'Tutorials' },
  { value: 'notes', label: 'Notes' },
  { value: 'profile', label: 'Update Profile' },
  // Add the new 'publications' category
  { value: 'publications', label: 'Update Publications' },
];

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

export default function Dashboard() {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const [serverImagePreview, setServerImagePreview] = useState(null);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [publications, setPublications] = useState([]);

  const token = localStorage.getItem('token');
  const isSingleDocCategory = SINGLE_DOC_CATEGORIES.includes(selectedCategory);
  const isMultiDocCategory = MULTI_DOC_CATEGORIES.includes(selectedCategory);

  // ------------------
  // 1. Fetch Admin Status
  // ------------------
  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        if (!token) throw new Error('Authentication required');
        const response = await axios.get(`${API_BASE_URL}/api/isAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error('Error fetching admin status:', err);
        setError({
          type: 'error',
          message:
            err.response?.data?.message || err.message || 'Failed to fetch admin status',
        });
      }
    };
    fetchAdminStatus();
  }, [token]);

  // Filter categories for non-admin users
  const filteredCategoryOptions = isAdmin
    ? CATEGORY_OPTIONS
    : CATEGORY_OPTIONS.filter(
        (opt) =>
          !['address', 'role', 'about', 'technology', 'tutorial', 'notes'].includes(
            opt.value
          )
      );

  // ------------------
  // 2. Validation Helpers
  // ------------------
  const validateField = (name, value) => {
    if (!value || value.trim() === '') return `${name} is required`;
    if (value.length < 2) return `${name} must be at least 2 characters`;
    return null;
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      address: ['institution', 'city', 'country'],
      role: ['roleName'],
      about: ['text'],
      technology: ['name', 'description'],
      tutorial: ['name', 'description', 'tutorialLink'],
      notes: ['name', 'description', 'noteLink'],
    };

    const fields = requiredFields[selectedCategory] || [];
    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) errors[field] = error;
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ------------------
  // 3. Fetch Publications
  // ------------------
  const fetchUserPublications = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error('Authentication required');

      const res = await axios.get(`${API_BASE_URL}/api/publications/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Adjust if your API response structure is different
      setPublications(res.data || []);
    } catch (error) {
      handleError(error, 'Failed to fetch your publications.');
    } finally {
      setLoading(false);
    }
  };

  // ------------------
  // 4. Category Selection
  // ------------------
  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    resetForm(); // Clear any prior data

    if (category === 'profile') {
      navigate('/update/profile');
      return;
    }

    if (category === 'publications') {
      fetchUserPublications();
      return;
    }

    if (!category || isMultiDocCategory) return;

    setLoading(true);
    try {
      if (!token) throw new Error('Authentication required');

      const res = await axios.get(`${API_BASE_URL}/api/${category}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data[0] || null : res.data;
      setExistingData(data);

      if (data) {
        setFormData(data);
        if (data.icon) {
          setServerImagePreview(data.icon);
        } else if (data.newIcon) {
          setServerImagePreview(data.newIcon);
        }
      }
    } catch (err) {
      handleError(err, `Failed to fetch ${category} info.`);
    } finally {
      setLoading(false);
    }
  };

  // ------------------
  // 5. Form Helpers
  // ------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      handleError({ message: 'Please upload an image file' });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      handleError({ message: 'File size should not exceed 3MB' });
      return;
    }

    setImageFile(file);
    setLocalPreview(URL.createObjectURL(file));
    setError(null);
  };

  // ------------------
  // 6. Submit Logic
  // ------------------
  const handleSubmit = async () => {
    if (!selectedCategory || !validateForm()) return;

    setSubmitLoading(true);
    try {
      if (!token) throw new Error('Authentication required');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': isFileUploadRequired() ? 'multipart/form-data' : 'application/json',
        },
      };

      const data = prepareFormData();
      const endpoint = getEndpoint();
      const method = isSingleDocCategory && existingData ? 'patch' : 'post';

      const response = await axios[method](endpoint, data, config);
      handleSubmitSuccess(response.data);
    } catch (err) {
      handleError(
        err,
        `Failed to ${existingData ? 'update' : 'create'} ${selectedCategory}.`
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const isFileUploadRequired = () =>
    ['technology', 'tutorial', 'notes'].includes(selectedCategory);

  const prepareFormData = () => {
    if (!isFileUploadRequired()) {
      return formData;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value != null) data.append(key, value);
    });

    if (imageFile) {
      const imageKey = selectedCategory === 'technology' ? 'icon' : 'newIcon';
      data.append(imageKey, imageFile);
    }
    return data;
  };

  const getEndpoint = () => {
    const base = `${API_BASE_URL}/api/${selectedCategory}`;
    return isSingleDocCategory && existingData ? `${base}/${existingData._id}` : base;
  };

  const handleSubmitSuccess = (data) => {
    if (isSingleDocCategory) {
      setExistingData(data);
      setFormData(data);
    } else {
      resetForm();
    }

    if (data.icon) {
      setServerImagePreview(data.icon);
    } else if (data.newIcon) {
      setServerImagePreview(data.newIcon);
    }

    setError({
      type: 'success',
      message: `${selectedCategory} ${existingData ? 'updated' : 'created'} successfully!`,
    });
  };

  // ------------------
  // 7. Error Handling
  // ------------------
  const handleError = (err, defaultMsg = 'An error occurred') => {
    let message = defaultMsg;
    if (typeof err === 'object') {
      message =
        err.response?.data?.message || err.response?.data || err.message || defaultMsg;
    } else if (typeof err === 'string') {
      message = err;
    }
    console.error('Error:', message);
    setError({ type: 'error', message });
  };

  const resetForm = () => {
    setExistingData(null);
    setFormData({});
    setImageFile(null);
    setLocalPreview(null);
    setServerImagePreview(null);
    setError(null);
    setFormErrors({});
  };

  // ------------------
  // 8. Rendering
  // ------------------
  const renderFormFields = () => {
    if (!selectedCategory) return null;

    const renderTextField = (label, name, options = {}) => (
      <TextField
        key={name}
        label={label}
        name={name}
        value={formData[name] || ''}
        onChange={handleFormChange}
        error={!!formErrors[name]}
        helperText={formErrors[name]}
        fullWidth
        sx={{ mb: 2 }}
        {...options}
      />
    );

    const renderImageUpload = () => (
      <>
        <Button variant="contained" component="label" sx={{ mb: 2 }}>
          Upload Icon
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>

        {localPreview && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Local preview:</Typography>
            <Avatar src={localPreview} alt="Local Preview" sx={{ width: 80, height: 80 }} />
          </Box>
        )}
        {serverImagePreview && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">Server preview:</Typography>
            <Avatar src={serverImagePreview} alt="Server Icon" sx={{ width: 80, height: 80 }} />
          </Box>
        )}
      </>
    );

    switch (selectedCategory) {
      case 'address':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('Room', 'room')}
            {renderTextField('Department', 'department')}
            {renderTextField('Institution', 'institution')}
            {renderTextField('City', 'city')}
            {renderTextField('State', 'state')}
            {renderTextField('Postal Code', 'postalCode')}
            {renderTextField('Country', 'country')}
          </Box>
        );
      case 'role':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('Role Name', 'roleName')}
          </Box>
        );
      case 'about':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('About Text', 'text', { multiline: true, rows: 4 })}
          </Box>
        );
      case 'technology':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('Name', 'name')}
            {renderTextField('Description', 'description', { multiline: true, rows: 3 })}
            {renderTextField('Download Link', 'downloadLink')}
            {renderImageUpload()}
          </Box>
        );
      case 'tutorial':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('Name', 'name')}
            {renderTextField('Description', 'description', { multiline: true, rows: 3 })}
            {renderTextField('Tutorial Link', 'tutorialLink')}
            {renderImageUpload()}
          </Box>
        );
      case 'notes':
        return (
          <Box sx={{ mt: 2 }}>
            {renderTextField('Name', 'name')}
            {renderTextField('Description', 'description', { multiline: true, rows: 3 })}
            {renderTextField('Note Link', 'noteLink')}
            {renderImageUpload()}
          </Box>
        );
      case 'publications':
        // A fresher, responsive UI for the publications list
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your Publications
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : publications.length === 0 ? (
              <Typography variant="body1">
                No publications found. You can create new publications using the “Add Publication” form or ask an admin to link you as an author.
              </Typography>
            ) : (
              <List>
                {publications.map((pub) => (
                  <ListItem
                    key={pub._id}
                    divider
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      boxShadow: 1,
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="bold">
                          {pub.title}
                        </Typography>
                      }
                      secondary={`Year: ${pub.year}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={() => navigate(`/publication/edit/${pub._id}`)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 5, px: { xs: 2, md: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Dashboard
      </Typography>

      {/* Snackbar for errors/success */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity={error?.type || 'error'} sx={{ width: '100%' }}>
          {error?.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Left Panel */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Category"
              onChange={(e) => handleSelectCategory(e.target.value)}
            >
              <MenuItem value="">-- Select Category --</MenuItem>
              {filteredCategoryOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedCategory &&
            (loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              renderFormFields()
            ))}

          {/* Only show Create/Update buttons for non-publication forms */}
          {selectedCategory &&
            selectedCategory !== 'publications' &&
            !loading &&
            isMultiDocCategory && (
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={submitLoading} fullWidth>
                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Create'}
              </Button>
            )}

          {selectedCategory &&
            selectedCategory !== 'publications' &&
            !loading &&
            isSingleDocCategory &&
            existingData && (
              <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={submitLoading} fullWidth>
                {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
              </Button>
            )}
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={6}>
          {selectedCategory ? (
            loading ? (
              <Typography variant="body2" color="textSecondary">
                Fetching {selectedCategory} info...
              </Typography>
            ) : selectedCategory === 'publications' ? (
              <Typography variant="body2" sx={{ mt: 2, display: { xs: 'none', md: 'block' } }}>
                Your publications are shown on the left.
              </Typography>
            ) : isSingleDocCategory && existingData ? (
              <Typography variant="body2" color="textSecondary">
                Editing existing {selectedCategory} (ID: {existingData._id})
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {isSingleDocCategory
                  ? `No ${selectedCategory} found. You can create one now.`
                  : `Add a new ${selectedCategory}.`}
              </Typography>
            )
          ) : (
            <Typography variant="body2" color="textSecondary">
              Please select a category...
            </Typography>
          )}
        </Grid>

      </Grid>
    </Box>
  );
}
