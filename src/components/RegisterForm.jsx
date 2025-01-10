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

const RegisterForm = () => {
  const [submitting, setSubmitting] = useState(false);

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
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        const response = await axiosInstance.get(`${API_BASE_URL}/api/role`);
        const roleNames = response.data.map((role) => role.roleName);
        setRoles(roleNames);
      } catch (error) {
        setRolesError('Failed to load roles. Please try again later.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // --------------------------------
  // removeEducationField
  // --------------------------------
  const removeEducationField = (index) => {
    setFormData((prev) => {
      const newEducation = [...prev.education];
      newEducation.splice(index, 1);
      return { ...prev, education: newEducation };
    });
  };

  // --------------------------------
  // removeExperienceField
  // --------------------------------
  const removeExperienceField = (index) => {
    setFormData((prev) => {
      const newExperience = [...prev.experience];
      newExperience.splice(index, 1);
      return { ...prev, experience: newExperience };
    });
  };

  // --------------------------------
  // removeLink
  // --------------------------------
  const removeLink = (linkType) => {
    setFormData((prev) => {
      const updatedLinks = prev.links.filter((l) => l.linkType !== linkType);
      return { ...prev, links: updatedLinks };
    });

    // Re-insert the link type back into availableSocialLinks if you want it selectable again
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

  const validate = () => {
    const newErrors = {};

    // Basic required fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!image) newErrors.image = 'Image is required';

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...formData.education];
    newEducation[index][field] = value;
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData((prev) => ({ ...prev, experience: newExperience }));
  };

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

  const addEducationField = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', startDate: '', endDate: '' },
      ],
    }));
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

  const handleSubmit = async () => {
    if (!validate()) return; // If form is invalid, do nothing

    setSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('image', image);
    formDataToSend.append('education', JSON.stringify(formData.education));
    formDataToSend.append('experience', JSON.stringify(formData.experience));
    formDataToSend.append('links', JSON.stringify(formData.links));

    try {
      await axiosInstance.post(
        `${API_BASE_URL}/api/users/register`,
        formDataToSend,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      alert('Registration failed: ' + error.message);
    } finally {
      // Always set submitting to false, whether success or failure
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ py: 5, px: { xs: 2, md: 5 } }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Register
      </Typography>

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

      {/* Password */}
      <TextField
        label="Password"
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
          Upload Image
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
        {(submitting || rolesLoading) ? <CircularProgress size={24} /> : 'Register'}
      </Button>

      {rolesError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {rolesError}
        </Typography>
      )}
    </Box>
  );
};

export default RegisterForm;
