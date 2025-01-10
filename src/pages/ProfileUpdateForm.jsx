import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Link as LinkIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  YouTube as YouTubeIcon,
  X as XIcon,
} from '@mui/icons-material';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom'; 
import { API_BASE_URL } from '../config';

const ProfileUpdateForm = () => {
  const [userId, setUserId] = useState(null);
  const [loadingUserId, setLoadingUserId] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();

  // ----------------------------
  // Form Data
  // ----------------------------
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    bio: '',
    education: [{ institution: '', degree: '', startDate: '', endDate: '' }],
    experience: [{ institution: '', degree: '', startDate: '', endDate: '' }],
    links: [],
    password: '',
  });

  // For roles
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);

  // Social link states
  const [availableSocialLinks, setAvailableSocialLinks] = useState([
    { type: 'Website', icon: LinkIcon },
    { type: 'Facebook', icon: FacebookIcon },
    { type: 'Instagram', icon: InstagramIcon },
    { type: 'LinkedIn', icon: LinkedInIcon },
    { type: 'GitHub', icon: GitHubIcon },
    { type: 'YouTube', icon: YouTubeIcon },
    { type: 'X', icon: XIcon },
  ]);
  const [currentLink, setCurrentLink] = useState({ linkType: '', link: '' });

  // Image for upload
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // Client-side validation errors
  const [errors, setErrors] = useState({});

  // ----------------------------
  // 1. Fetch User ID
  // ----------------------------
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        setLoadingUserId(true);
        const token = localStorage.getItem('token'); // Ensure token is stored appropriately
        const response = await axiosInstance.get(`${API_BASE_URL}/api/userid`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        setErrorMessage('Failed to retrieve user ID.');
        console.error(error);
      } finally {
        setLoadingUserId(false);
      }
    };

    fetchUserId();
  }, []);

  // ----------------------------
  // 2. Fetch Roles
  // ----------------------------
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await axiosInstance.get(`${API_BASE_URL}/api/role`);
        const roleNames = response.data.map((role) => role.roleName);
        setRoles(roleNames);
        
      } catch (error) {
        setRolesError('Failed to load roles. Please try again later.');
        console.error(error);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  }, []);

  // ----------------------------
  // 3. Fetch Current User Data
  // ----------------------------
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoadingUserData(true);
        console.log("Fetching user data");
        const token = localStorage.getItem('token'); // Ensure token is stored appropriately
        const res = await axiosInstance.get(`${API_BASE_URL}/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = res.data;
        
        setFormData({
          name: user.name || '',
          email: user.email || '',
          address: user.address || '',
          role: user.role || '',
          bio: user.bio || '',
          education: user.education && user.education.length > 0 
                      ? user.education 
                      : [{ institution: '', degree: '', startDate: '', endDate: '' }],
          experience: user.experience && user.experience.length > 0 
                      ? user.experience 
                      : [{ institution: '', degree: '', startDate: '', endDate: '' }],
          links: user.links || [],
          password: '', // Password is blank by default
        });

        if (user.image) {
          setPreview(user.image);
        }

        if (user.links && user.links.length > 0) {
          const usedLinkTypes = user.links.map((link) => link.linkType);
          setAvailableSocialLinks((prev) =>
            prev.filter((sl) => !usedLinkTypes.includes(sl.type))
          );
        }
        console.log("Fetched user data");
      } catch (error) {
        setErrorMessage('Failed to load user data.');
        console.error(error);
      } finally {
        setLoadingUserData(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // -------------------------------------------------
  // 4. Handling Input Changes
  // -------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Education
  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    }));
  };

  const removeEducationField = (index) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation.splice(index, 1);
      return { ...prev, education: newEducation };
    });
  };

  // Experience
  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: newExperience }));
  };

  const addExperienceField = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    }));
  };

  const removeExperienceField = (index) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience.splice(index, 1);
      return { ...prev, experience: newExperience };
    });
  };

  // Links
  const handleLinkChange = (field, value) => {
    setCurrentLink((prev) => ({ ...prev, [field]: value }));
  };

  const addLink = () => {
    if (currentLink.linkType && currentLink.link) {
      setFormData((prev) => ({
        ...prev,
        links: [...prev.links, { ...currentLink }],
      }));

      setAvailableSocialLinks((prev) =>
        prev.filter((link) => link.type !== currentLink.linkType)
      );

      setCurrentLink({ linkType: '', link: '' });
    }
  };

  const removeLink = (linkType) => {
    setFormData((prev) => {
      const updatedLinks = prev.links.filter((l) => l.linkType !== linkType);
      return { ...prev, links: updatedLinks };
    });

    // Allow re-adding the same link type
    const allSocialLinks = [
      { type: 'Website', icon: LinkIcon },
      { type: 'Facebook', icon: FacebookIcon },
      { type: 'Instagram', icon: InstagramIcon },
      { type: 'LinkedIn', icon: LinkedInIcon },
      { type: 'GitHub', icon: GitHubIcon },
      { type: 'YouTube', icon: YouTubeIcon },
      { type: 'X', icon: XIcon },
    ];
    const removedLinkObj = allSocialLinks.find((l) => l.type === linkType);
    if (removedLinkObj) {
      setAvailableSocialLinks((prev) => [...prev, removedLinkObj]);
    }
  };

  // -------------------------------------------------
  // 5. Image Upload
  // -------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // -------------------------------------------------
  // 6. Validate & Submit
  // -------------------------------------------------
  const validate = () => {
    const newErrors = {};

    // Name, email, etc. can be required or optional as you see fit
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';

    // Optional: You could require the image for new registration, 
    // but for updating, it might not be required. 
    // if (!preview) newErrors.image = 'Image is required';

    // Validate Education
    formData?.education?.forEach((edu, index) => {
      if (!edu.institution) {
        newErrors[`education[${index}].institution`] = 'Institution is required';
      }
      if (!edu.degree) {
        newErrors[`education[${index}].degree`] = 'Degree is required';
      }
    });

    // Validate Experience
    formData?.experience?.forEach((exp, index) => {
      if (!exp.institution) {
        newErrors[`experience[${index}].institution`] = 'Institution is required';
      }
      if (!exp.degree) {
        newErrors[`experience[${index}].degree`] = 'Position is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    setErrorMessage('');

    // Build a formData object for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('bio', formData.bio);
    // Only append password if user actually wants to update it 
    if (formData.password.trim() !== '') {
      formDataToSend.append('password', formData.password);
    }
    // Append image only if user selected a new file
    if (image) {
      formDataToSend.append('image', image);
    }
    formDataToSend.append('education', JSON.stringify(formData.education));
    formDataToSend.append('experience', JSON.stringify(formData.experience));
    formDataToSend.append('links', JSON.stringify(formData.links));

    try {
      const token = localStorage.getItem('token'); // Ensure token is stored appropriately
      await axiosInstance.patch(`${API_BASE_URL}/api/users`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Profile updated successfully!');
      navigate('/'); // Redirect to desired page
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data || error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------------------------------------
  // 7. Render
  // -------------------------------------------------
  if (loadingUserId || loadingUserData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          {loadingUserId ? 'Retrieving user information...' : 'Loading profile...'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 5, px: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Update Profile
      </Typography>

      {errorMessage && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Name */}
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={Boolean(errors.name)}
        helperText={errors.name}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Email */}
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={Boolean(errors.email)}
        helperText={errors.email}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Address */}
      <TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Role */}
      <TextField
        select
        label="Role"
        name="role"
        value={formData.role}
        onChange={handleChange}
        error={Boolean(errors.role)}
        helperText={errors.role || (rolesError && 'Error loading roles')}
        fullWidth
        sx={{ mb: 2 }}
        disabled={rolesLoading}
      >
        {rolesLoading ? (
          <MenuItem disabled>Loading roles...</MenuItem>
        ) : rolesError ? (
          <MenuItem disabled>Failed to load roles</MenuItem>
        ) : (
          roles.map((role) => (
            <MenuItem key={role} value={role}>
              {role}
            </MenuItem>
          ))
        )}
      </TextField>

      {/* Bio */}
      <TextField
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Education Timeline */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Education Timeline
      </Typography>
      {formData.education.map((entry, index) => (
        <Box
          key={`education-${index}`}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Education Entry {index + 1}
            </Typography>
            {formData.education.length > 1 && (
              <Button
                variant="contained"
                color="error"
                onClick={() => removeEducationField(index)}
              >
                Remove
              </Button>
            )}
          </Box>

          <TextField
            label="Institution"
            value={entry.institution}
            onChange={(e) =>
              handleEducationChange(index, 'institution', e.target.value)
            }
            error={Boolean(errors[`education[${index}].institution`])}
            helperText={errors[`education[${index}].institution`]}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Degree"
            value={entry.degree}
            onChange={(e) =>
              handleEducationChange(index, 'degree', e.target.value)
            }
            error={Boolean(errors[`education[${index}].degree`])}
            helperText={errors[`education[${index}].degree`]}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="date"
            label="Start Date"
            value={entry.startDate}
            onChange={(e) =>
              handleEducationChange(index, 'startDate', e.target.value)
            }
            fullWidth
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            value={entry.endDate}
            onChange={(e) =>
              handleEducationChange(index, 'endDate', e.target.value)
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}
      <Button onClick={addEducationField} variant="outlined" sx={{ mb: 3 }}>
        Add Education Entry
      </Button>

      {/* Experience Timeline */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Experience Timeline
      </Typography>
      {formData.experience.map((entry, index) => (
        <Box
          key={`experience-${index}`}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Experience Entry {index + 1}
            </Typography>
            {formData.experience.length > 1 && (
              <Button
                variant="contained"
                color="error"
                onClick={() => removeExperienceField(index)}
              >
                Remove
              </Button>
            )}
          </Box>

          <TextField
            label="Institution"
            value={entry.institution}
            onChange={(e) =>
              handleExperienceChange(index, 'institution', e.target.value)
            }
            error={Boolean(errors[`experience[${index}].institution`])}
            helperText={errors[`experience[${index}].institution`]}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Position"
            value={entry.degree}
            onChange={(e) =>
              handleExperienceChange(index, 'degree', e.target.value)
            }
            error={Boolean(errors[`experience[${index}].degree`])}
            helperText={errors[`experience[${index}].degree`]}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="date"
            label="Start Date"
            value={entry.startDate}
            onChange={(e) =>
              handleExperienceChange(index, 'startDate', e.target.value)
            }
            fullWidth
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            value={entry.endDate}
            onChange={(e) =>
              handleExperienceChange(index, 'endDate', e.target.value)
            }
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}
      <Button onClick={addExperienceField} variant="outlined" sx={{ mb: 3 }}>
        Add Experience Entry
      </Button>

      {/* Social Links Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Social Links
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            select
            label="Link Type"
            value={currentLink.linkType}
            onChange={(e) => handleLinkChange('linkType', e.target.value)}
            sx={{ minWidth: 120 }}
          >
            {availableSocialLinks.map((option) => (
              <MenuItem key={option.type} value={option.type}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <option.icon />
                  {option.type}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="URL"
            value={currentLink.link}
            onChange={(e) => handleLinkChange('link', e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={addLink}
            disabled={!currentLink.linkType || !currentLink.link}
          >
            Add Link
          </Button>
        </Box>

        {/* Display added links */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {formData.links.map((link, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                border: '1px solid #ddd',
                borderRadius: 1,
              }}
            >
              {React.createElement(
                [
                  LinkIcon,
                  FacebookIcon,
                  InstagramIcon,
                  LinkedInIcon,
                  GitHubIcon,
                  YouTubeIcon,
                  XIcon,
                ][
                  [
                    'Website',
                    'Facebook',
                    'Instagram',
                    'LinkedIn',
                    'GitHub',
                    'YouTube',
                    'X',
                  ].indexOf(link.linkType)
                ]
              )}
              <Typography>{link.link}</Typography>
              <IconButton
                size="small"
                onClick={() => removeLink(link.linkType)}
                sx={{ ml: 1 }}
              >
                <XIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Optional: Password */}
      <TextField
        label="Change Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={Boolean(errors.password)}
        helperText={errors.password}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Image Upload & Preview */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 5,
        }}
      >
        {errors.image && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errors.image}
          </Typography>
        )}
        <Button variant="contained" component="label" sx={{ mb: 2, display: 'block' }}>
          Upload New Profile Image
          <input type="file" hidden accept="image/*" onChange={handleImageChange} />
        </Button>
        {preview && (
          <Avatar src={preview} alt="Preview" sx={{ width: 100, height: 100, mb: 2 }} />
        )}
      </Box>

      {/* Submit */}
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={submitting || rolesLoading || !!rolesError}
      >
        {submitting ? <CircularProgress size={24} /> : 'Update Profile'}
      </Button>
    </Box>
  );
};

export default ProfileUpdateForm;
