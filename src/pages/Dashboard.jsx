import React, { useState , useEffect} from 'react';
import {
  Typography, Box, Grid, MenuItem, Select, FormControl, InputLabel,
  Button, TextField, Avatar, Snackbar, CircularProgress
} from '@mui/material';
// ADD THIS IMPORT:
import Alert from '@mui/material/Alert';
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
   { value: 'profile', label: 'Update Profile' } // Added new category for profile updates

];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Dashboard() {
  const navigate = useNavigate(); // Add this at the start of your Dashboard component

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


  const token = localStorage.getItem('token');
  const isSingleDocCategory = SINGLE_DOC_CATEGORIES.includes(selectedCategory);
  const isMultiDocCategory = MULTI_DOC_CATEGORIES.includes(selectedCategory);

  useEffect(() => {
  const fetchAdminStatus = async () => {
    try {
      if (!token) throw new Error('Authentication required');
      const response = await axios.get(`${API_BASE_URL}/api/isAdmin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAdmin(response.data.isAdmin);
    } catch (err) {
      console.error(err.message);
      setError({ type: 'error', message: 'Failed to fetch admin status' });
    }
  };

  fetchAdminStatus();
}, [token]);

const filteredCategoryOptions = isAdmin
  ? CATEGORY_OPTIONS
  : CATEGORY_OPTIONS.filter(
      (opt) => !['address', 'role', 'about', 'technology', 'tutorial', 'notes'].includes(opt.value)
    );


  // ------------------
  // Validation Helpers
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
      notes: ['name', 'description', 'noteLink']
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
  // Category Selection
  // ------------------
  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    resetForm();

     if (category === 'profile') {
    navigate('/update/profile'); // Redirects user to the profile update route
    return;
  }

    // If it's a multi-doc category (role, tech, tutorial, notes), we don't fetch a single existing doc
    if (!category || isMultiDocCategory) return;

    setLoading(true);
    try {
      if (!token) throw new Error('Authentication required');

      const res = await axios.get(`${API_BASE_URL}/api/${category}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Because single doc categories might be an array or a single object,
      // pick the first element if it's an array.
      const data = Array.isArray(res.data) ? res.data[0] || null : res.data;
      setExistingData(data);

      // If we got an existing doc, fill in our form and handle any icon fields
      if (data) {
        setFormData(data);
        // For single-doc categories that might have icon/newIcon
        if (data.icon) {
          setServerImagePreview(data.icon);
        } else if (data.newIcon) {
          setServerImagePreview(data.newIcon);
        }
      }
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------
  // Form Helpers
  // ------------------
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Re-validate this field if it previously had an error
    if (formErrors[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic checks
    if (!file.type.startsWith('image/')) {
      handleError({ message: 'Please upload an image file' });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      handleError({ message: 'File size should not exceed 5MB' });
      return;
    }

    setImageFile(file);
    setLocalPreview(URL.createObjectURL(file));
    setError(null); // clear any error related to file
  };

  // ------------------
  // Submit Logic
  // ------------------
  const handleSubmit = async () => {
    if (!selectedCategory || !validateForm()) return;

    setSubmitLoading(true);
    try {
      if (!token) throw new Error('Authentication required');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': isFileUploadRequired() ? 'multipart/form-data' : 'application/json'
        }
      };

      const data = prepareFormData();
      const endpoint = getEndpoint();
      // If it's a single doc category AND we already have existing data, do PATCH; otherwise POST
      const method = isSingleDocCategory && existingData ? 'patch' : 'post';

      const response = await axios[method](endpoint, data, config);
      handleSubmitSuccess(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const isFileUploadRequired = () =>
    ['technology', 'tutorial', 'notes'].includes(selectedCategory);

  const prepareFormData = () => {
    // For single-doc categories that don't need an image, just submit JSON
    if (!isFileUploadRequired()) {
      return formData;
    }

    // For categories requiring an image (technology, tutorial, notes), use FormData
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value != null) data.append(key, value);
    });

    // Upload image if provided
    if (imageFile) {
      // technology => 'icon', tutorial/notes => 'newIcon'
      const imageKey = selectedCategory === 'technology' ? 'icon' : 'newIcon';
      data.append(imageKey, imageFile);
    }
    return data;
  };

  const getEndpoint = () => {
    const base = `${API_BASE_URL}/api/${selectedCategory}`;
    // If single-doc & we have existing data => PATCH /:id
    return isSingleDocCategory && existingData ? `${base}/${existingData._id}` : base;
  };

  const handleSubmitSuccess = (data) => {
    // If it's single-doc, update existing data in state
    if (isSingleDocCategory) {
      setExistingData(data);
      setFormData(data);
    } else {
      // If multi-doc, clear the form
      resetForm();
    }

    // Update the server preview if the returned document has icon/newIcon
    if (data.icon) {
      setServerImagePreview(data.icon);
    } else if (data.newIcon) {
      setServerImagePreview(data.newIcon);
    }

    // Show success message
    setError({
      type: 'success',
      message: `${selectedCategory} ${existingData ? 'updated' : 'created'} successfully!`
    });
  };

  // ------------------
  // Error Handling
  // ------------------
  const handleError = (err) => {
    const message = err.response?.data || err.message || 'An error occurred';
    console.log(err);
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
  // Rendering
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
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 5, px: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Snackbar for errors/success */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setError(null)}
          severity={error?.type || 'error'}
          sx={{ width: '100%' }}
        >
          {error?.message}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        {/* Left panel */}
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedCategory && renderFormFields()
          )}

          {selectedCategory && !loading && (
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                isSingleDocCategory && existingData ? 'Update' : 'Create'
              )}
            </Button>
          )}
        </Grid>

        {/* Right panel */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Typography variant="body2" color="textSecondary">
              Fetching {selectedCategory} info...
            </Typography>
          ) : selectedCategory ? (
            isSingleDocCategory && existingData ? (
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
