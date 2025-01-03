
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
  Avatar
} from '@mui/material';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// We'll define which categories are single-doc vs multi-doc.
const SINGLE_DOC_CATEGORIES = ['address', 'resourcetext'];
const MULTI_DOC_CATEGORIES = ['role', 'technology', 'tutorial'];

const CATEGORY_OPTIONS = [
  { value: 'address', label: 'Address' },
  { value: 'role', label: 'Role' },
  { value: 'resourcetext', label: 'Resource Text' },
  { value: 'technology', label: 'Technologies' },
  { value: 'tutorial', label: 'Tutorials' }
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // This will hold the user's typed values (JSON fields)
  const [formData, setFormData] = useState({});
  // This holds the local (pre-submit) image file (if any)
  const [imageFile, setImageFile] = useState(null);
  // Local preview of the new image file before submit
  const [localPreview, setLocalPreview] = useState(null);
  // Once we submit and the server returns a new doc, show the updated image
  const [serverImagePreview, setServerImagePreview] = useState(null);

  const token = localStorage.getItem('token');

  /**
   * Decide if the selected category is single-doc or multi-doc
   */
  const isSingleDocCategory = SINGLE_DOC_CATEGORIES.includes(selectedCategory);
  const isMultiDocCategory = MULTI_DOC_CATEGORIES.includes(selectedCategory);

  // When the user selects a category from the dropdown
  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);

    // Clear the states whenever category changes
    setExistingData(null);
    setFormData({});
    setImageFile(null);
    setLocalPreview(null);
    setServerImagePreview(null);

    // If no category, stop
    if (!category) return;

    // If it's a multi-doc category, we do NOT fetch or set existing data
    // because we can have multiple docs and just want to create new each time.
    // If it's single-doc (address/resourcetext), we fetch existing data (the first doc).
    if (isMultiDocCategory) {
      return;
    }

    // Single-doc fetch
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/${category}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let data = res.data;
      if (Array.isArray(data) && data.length > 0) {
        data = data[0]; // If the server returns an array, pick first
      } else if (Array.isArray(data) && data.length === 0) {
        data = null;
      }

      setExistingData(data);
      if (data) {
        setFormData(data);
        // If there's an icon field, show it in server preview (not likely for address/resourcetext)
        if (data.icon) {
          setServerImagePreview(`${API_BASE_URL}/uploads/${data.icon}`);
        }
      }
    } catch (err) {
      console.error(`Failed to fetch ${category}:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Generic form field changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle local file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setLocalPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!selectedCategory) return;

    // Some categories require multipart/form-data (technology, tutorial)
    // because they have icon uploads. Role might be JSON or no file, so let's handle that.
    // We'll assume "role" is no file. So isFileCategory = technology || tutorial
    const isFileCategory = selectedCategory === 'technology' || selectedCategory === 'tutorial';

    try {
      let response;

      // If it's single-doc (address, resourcetext):
      //   => If there's an existing doc, PATCH. Otherwise, POST.
      // If it's multi-doc (role, technology, tutorial):
      //   => Always POST (we want to create a brand new doc every time).
      const isUpdatingSingleDoc = isSingleDocCategory && existingData && existingData._id;

      if (isFileCategory) {
        // ============ SEND MULTIPART/FORM-DATA ============
        const dataToSend = new FormData();

        // Append text fields
        Object.keys(formData).forEach((key) => {
          dataToSend.append(key, formData[key]);
        });

        // technology => 'icon', tutorial => 'newIcon'
        if (imageFile) {
          if (selectedCategory === 'technology') {
            dataToSend.append('icon', imageFile);
          } else {
            dataToSend.append('newIcon', imageFile);
          }
        }

        // Debug
        console.log('Inspecting FormData contents:');
        for (let [key, val] of dataToSend.entries()) {
          console.log(key, val);
        }

        if (isMultiDocCategory) {
          // (Role, Technology, Tutorial) => ALWAYS CREATE
          response = await axios.post(
            `${API_BASE_URL}/api/${selectedCategory}`,
            dataToSend,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} created successfully!`);
        } else if (isUpdatingSingleDoc) {
          // Single-doc + already has an _id => update
          response = await axios.patch(
            `${API_BASE_URL}/api/${selectedCategory}/${existingData._id}`,
            dataToSend,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} updated successfully!`);
        } else {
          // Single-doc + no doc => create
          response = await axios.post(
            `${API_BASE_URL}/api/${selectedCategory}`,
            dataToSend,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} created successfully!`);
        }
      } else {
        // ============ SEND JSON (NO FILES) ============
        if (isMultiDocCategory) {
          // For multi-doc categories (Role) we always create
          response = await axios.post(
            `${API_BASE_URL}/api/${selectedCategory}`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} created successfully!`);
        } else if (isUpdatingSingleDoc) {
          // Single doc, has an _id => update
          response = await axios.patch(
            `${API_BASE_URL}/api/${selectedCategory}/${existingData._id}`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} updated successfully!`);
        } else {
          // Single doc, no existing => create
          response = await axios.post(
            `${API_BASE_URL}/api/${selectedCategory}`,
            formData,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          alert(`${selectedCategory} created successfully!`);
        }
      }

      // If the server returns the doc, we can handle the UI
      if (response && response.data) {
        // For single-doc categories, we set that doc in state (in case we want to update again)
        if (isSingleDocCategory) {
          setExistingData(response.data);
          setFormData(response.data);
        }
        // For multi-doc categories, we probably want to clear the form
        if (isMultiDocCategory) {
          setFormData({});
          setImageFile(null);
          setLocalPreview(null);
          setServerImagePreview(null);
        }
        // If there's a new icon in the doc
        if (response.data.icon) {
          setServerImagePreview(`${API_BASE_URL}/uploads/${response.data.icon}`);
        }
      }
    } catch (err) {
      console.error(err);
      alert(`Failed to submit ${selectedCategory}: ${err.message}`);
    }
  };

  // Render the input fields depending on the category
  const renderFormFields = () => {
    if (!selectedCategory) return null;
    switch (selectedCategory) {
      case 'address':
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Room"
              name="room"
              value={formData.room || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Department"
              name="department"
              value={formData.department || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Institution"
              name="institution"
              value={formData.institution || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="State"
              name="state"
              value={formData.state || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Postal Code"
              name="postalCode"
              value={formData.postalCode || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country || ''}
              onChange={handleFormChange}
              fullWidth
            />
          </Box>
        );

      case 'role':
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Role Name"
              name="roleName"
              value={formData.roleName || ''}
              onChange={handleFormChange}
              fullWidth
            />
          </Box>
        );

      case 'resourcetext':
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Resource Text"
              name="text"
              value={formData.text || ''}
              onChange={handleFormChange}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        );

      case 'technology':
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Download Link"
              name="downloadLink"
              value={formData.downloadLink || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button variant="contained" component="label">
              Upload Icon
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {localPreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Local preview (before submit):</Typography>
                <Avatar
                  src={localPreview}
                  alt="Local Preview"
                  sx={{ width: 80, height: 80 }}
                />
              </Box>
            )}
            {serverImagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Server preview (after submit):</Typography>
                <Avatar
                  src={serverImagePreview}
                  alt="Server Icon"
                  sx={{ width: 80, height: 80 }}
                />
              </Box>
            )}
          </Box>
        );

      case 'tutorial':
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tutorial Link"
              name="tutorialLink"
              value={formData.tutorialLink || ''}
              onChange={handleFormChange}
              fullWidth
              sx={{ mb: 2 }}
            />

            <Button variant="contained" component="label">
              Upload Icon
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {localPreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Local preview (before submit):</Typography>
                <Avatar
                  src={localPreview}
                  alt="Local Preview"
                  sx={{ width: 80, height: 80 }}
                />
              </Box>
            )}
            {serverImagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Server preview (after submit):</Typography>
                <Avatar
                  src={serverImagePreview}
                  alt="Server Icon"
                  sx={{ width: 80, height: 80 }}
                />
              </Box>
            )}
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

      <Grid container spacing={3}>
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
              {CATEGORY_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* If a category is chosen, show the respective form fields */}
          {!loading && selectedCategory && renderFormFields()}

          {/* Submit button */}
          {selectedCategory && !loading && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit}>
              {/* For single-doc categories, we show "Update" if existingData found, else "Create".
                  For multi-doc categories, always "Create" since we want to keep adding. */}
              {isSingleDocCategory && existingData ? 'Update' : 'Create'}
            </Button>
          )}
        </Grid>

        {/* On the right side, we show info or placeholders */}
        <Grid item xs={12} md={6}>
          {loading ? (
            <Typography variant="body2" color="textSecondary">
              Fetching {selectedCategory} info...
            </Typography>
          ) : selectedCategory ? (
            isSingleDocCategory && existingData ? (
              <Typography variant="body2" color="textSecondary">
                Editing existing {selectedCategory} (ID: {existingData._id}).
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                {isSingleDocCategory
                  ? `No ${selectedCategory} found. You can create one now.`
                  : `Add a new ${selectedCategory}.`
                }
              </Typography>
            )
          ) : (
            <Typography variant="body2" color="textSecondary">
              Please select a category ...
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
