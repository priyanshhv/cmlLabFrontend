

// import React, { useState } from 'react';
// import {
//   TextField,
//   Button,
//   Box,
//   MenuItem,
//   Typography,
//   Avatar
// } from '@mui/material';
// import axiosInstance from '../axiosInstance';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from '../config';

// const roles = ['PhD Student', 'Researcher'];

// const RegisterForm = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     address: '',
//     role: '',
//     bio: '',
//     timeline: [
//       {
//         institution: '',
//         degree: '',
//         startDate: '',
//         endDate: ''
//       }
//     ],
//     password: ''
//   });

//   const [image, setImage] = useState(null);   // Store the selected image
//   const [preview, setPreview] = useState(null); // Store the image preview URL
//   const [errors, setErrors] = useState({});
//   const navigate = useNavigate();

//   // Validation
//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = 'Name is required';
//     if (!formData.email) newErrors.email = 'Email is required';
//     if (!formData.role) newErrors.role = 'Role is required';
//     if (!formData.password) newErrors.password = 'Password is required';
//     if (!image) newErrors.image = 'Image is required';
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle text field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   // Handle image selection & preview
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file)); // Create a preview URL
//     }
//   };

//   // Handle timeline changes
//   const handleTimelineChange = (index, field, value) => {
//     const newTimeline = [...formData.timeline];
//     newTimeline[index][field] = value;
//     setFormData((prev) => ({ ...prev, timeline: newTimeline }));
//   };

//   // Add new (empty) timeline entry
//   const addTimelineField = () => {
//     setFormData((prev) => ({
//       ...prev,
//       timeline: [
//         ...prev.timeline,
//         { institution: '', degree: '', startDate: '', endDate: '' }
//       ]
//     }));
//   };

//   // **Remove** an existing timeline entry by index
//   const removeTimelineField = (index) => {
//     setFormData((prev) => {
//       const newTimeline = [...prev.timeline];
//       newTimeline.splice(index, 1);
//       return { ...prev, timeline: newTimeline };
//     });
//   };

//   // Submit the form
//   const handleSubmit = async () => {
//     if (!validate()) return;

//     const formDataToSend = new FormData();
//     formDataToSend.append('name', formData.name);
//     formDataToSend.append('email', formData.email);
//     formDataToSend.append('address', formData.address);
//     formDataToSend.append('role', formData.role);
//     formDataToSend.append('bio', formData.bio);
//     formDataToSend.append('password', formData.password);
//     formDataToSend.append('image', image); // Append the image file

//     // Append each timeline entry
//     formData.timeline.forEach((entry, idx) => {
//       formDataToSend.append(`timeline[${idx}][institution]`, entry.institution);
//       formDataToSend.append(`timeline[${idx}][degree]`, entry.degree);
//       formDataToSend.append(`timeline[${idx}][startDate]`, entry.startDate);
//       formDataToSend.append(`timeline[${idx}][endDate]`, entry.endDate);
//     });

//     try {
//       await axiosInstance.post(`${API_BASE_URL}/api/users/register`, formDataToSend, {
//         headers: {
//           'Content-Type': 'multipart/form-data' // For file uploads
//         }
//       });
//       alert('Registration successful! Redirecting to login page.');
//       navigate('/login');
//     } catch (error) {
//       console.error('Failed to register user:', error.response?.data || error.message);
//       alert('Failed to register. Please try again.');
//     }
//   };

//   return (
//     <Box sx={{ py: 5, px: { xs: 2, md: 5 } }}>
//       <Typography variant="h4" sx={{ mb: 3 }}>
//         Register
//       </Typography>

//       {/* Name */}
//       <TextField
//         label="Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         error={!!errors.name}
//         helperText={errors.name}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {/* Email */}
//       <TextField
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         error={!!errors.email}
//         helperText={errors.email}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {/* Address */}
//       <TextField
//         label="Address"
//         name="address"
//         value={formData.address}
//         onChange={handleChange}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {/* Role */}
//       <TextField
//         select
//         label="Role"
//         name="role"
//         value={formData.role}
//         onChange={handleChange}
//         error={!!errors.role}
//         helperText={errors.role}
//         fullWidth
//         sx={{ mb: 2 }}
//       >
//         {roles.map((role) => (
//           <MenuItem key={role} value={role}>
//             {role}
//           </MenuItem>
//         ))}
//       </TextField>

//       {/* Bio */}
//       <TextField
//         label="Bio"
//         name="bio"
//         value={formData.bio}
//         onChange={handleChange}
//         multiline
//         rows={4}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {/* Timeline Entries */}
//       {formData.timeline.map((entry, index) => (
//         <Box
//           key={index}
//           sx={{
//             mb: 2,
//             p: 2,
//             border: '1px solid #ddd',
//             borderRadius: '0.5rem'
//           }}
//         >
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               mb: 2
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//               Timeline Entry {index + 1}
//             </Typography>
//             {/* Remove Button for each timeline entry */}
//             {formData.timeline.length > 1 && (
//               <Button
//                 variant="contained"
//                 color="error"
//                 onClick={() => removeTimelineField(index)}
//               >
//                 Remove
//               </Button>
//             )}
//           </Box>

//           <TextField
//             label="Institution"
//             value={entry.institution}
//             onChange={(e) => handleTimelineChange(index, 'institution', e.target.value)}
//             fullWidth
//             sx={{ mb: 1 }}
//           />
//           <TextField
//             label="Degree"
//             value={entry.degree}
//             onChange={(e) => handleTimelineChange(index, 'degree', e.target.value)}
//             fullWidth
//             sx={{ mb: 1 }}
//           />
//           <TextField
//             type="date"
//             label="Start Date"
//             value={entry.startDate}
//             onChange={(e) => handleTimelineChange(index, 'startDate', e.target.value)}
//             fullWidth
//             sx={{ mb: 1 }}
//             InputLabelProps={{ shrink: true }}
//           />
//           <TextField
//             type="date"
//             label="End Date"
//             value={entry.endDate}
//             onChange={(e) => handleTimelineChange(index, 'endDate', e.target.value)}
//             fullWidth
//             sx={{ mb: 1 }}
//             InputLabelProps={{ shrink: true }}
//           />
//         </Box>
//       ))}

//       {/* Add Timeline Entry Button */}
//       <Button onClick={addTimelineField} variant="outlined" sx={{ mb: 2 }}>
//         Add Timeline Entry
//       </Button>

//       {/* Password */}
//       <TextField
//         label="Password"
//         name="password"
//         type="password"
//         value={formData.password}
//         onChange={handleChange}
//         error={!!errors.password}
//         helperText={errors.password}
//         fullWidth
//         sx={{ mb: 2 }}
//       />

//       {/* Image Errors */}
//       {errors.image && (
//         <Typography variant="body2" color="error" sx={{ mb: 2 }}>
//           {errors.image}
//         </Typography>
//       )}

//       {/* Image Upload & Preview */}
//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           py: 5
//         }}
//       >
//         <Button
//           variant="contained"
//           component="label"
//           sx={{ mb: 2, display: 'block' }}
//         >
//           Upload Image
//           <input
//             type="file"
//             hidden
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//         </Button>
//         {preview && (
//           <Avatar
//             src={preview}
//             alt="Preview"
//             sx={{ width: 100, height: 100, mb: 2 }}
//           />
//         )}
//       </Box>

//       {/* Submit */}
//       <Button variant="contained" onClick={handleSubmit}>
//         Register
//       </Button>
//     </Box>
//   );
// };

// export default RegisterForm;

import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  MenuItem,
  Typography,
  Avatar,
  CircularProgress
} from '@mui/material';
import axiosInstance from '../axiosInstance';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
    bio: '',
    timeline: [
      {
        institution: '',
        degree: '',
        startDate: '',
        endDate: ''
      }
    ],
    password: ''
  });

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [rolesError, setRolesError] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setRolesLoading(true);
        setRolesError(null);
        const response = await axiosInstance.get(`${API_BASE_URL}/api/role`);
        // Extract roleName from each role object
        const roleNames = response.data.map(role => role.roleName);
        setRoles(roleNames);
      } catch (error) {
        console.error('Failed to fetch roles:', error);
        setRolesError('Failed to load roles. Please try again later.');
      } finally {
        setRolesLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image selection & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle timeline changes
  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index][field] = value;
    setFormData((prev) => ({ ...prev, timeline: newTimeline }));
  };

  // Add new timeline entry
  const addTimelineField = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { institution: '', degree: '', startDate: '', endDate: '' }
      ]
    }));
  };

  // Remove timeline entry
  const removeTimelineField = (index) => {
    setFormData((prev) => {
      const newTimeline = [...prev.timeline];
      newTimeline.splice(index, 1);
      return { ...prev, timeline: newTimeline };
    });
  };

  // Submit the form
  const handleSubmit = async () => {
    if (!validate()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('role', formData.role);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('image', image);

    formData.timeline.forEach((entry, idx) => {
      formDataToSend.append(`timeline[${idx}][institution]`, entry.institution);
      formDataToSend.append(`timeline[${idx}][degree]`, entry.degree);
      formDataToSend.append(`timeline[${idx}][startDate]`, entry.startDate);
      formDataToSend.append(`timeline[${idx}][endDate]`, entry.endDate);
    });

    try {
      await axiosInstance.post(`${API_BASE_URL}/api/users/register`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Registration successful! Redirecting to login page.');
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      alert(`Failed to register: ${errorMessage}`);
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
        error={!!errors.name}
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
        error={!!errors.email}
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
        error={!!errors.role}
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

      {/* Timeline Entries */}
      {formData.timeline.map((entry, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '0.5rem'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              Timeline Entry {index + 1}
            </Typography>
            {formData.timeline.length > 1 && (
              <Button
                variant="contained"
                color="error"
                onClick={() => removeTimelineField(index)}
              >
                Remove
              </Button>
            )}
          </Box>

          <TextField
            label="Institution"
            value={entry.institution}
            onChange={(e) => handleTimelineChange(index, 'institution', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            label="Degree"
            value={entry.degree}
            onChange={(e) => handleTimelineChange(index, 'degree', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
          />
          <TextField
            type="date"
            label="Start Date"
            value={entry.startDate}
            onChange={(e) => handleTimelineChange(index, 'startDate', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="End Date"
            value={entry.endDate}
            onChange={(e) => handleTimelineChange(index, 'endDate', e.target.value)}
            fullWidth
            sx={{ mb: 1 }}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      ))}

      {/* Add Timeline Entry Button */}
      <Button onClick={addTimelineField} variant="outlined" sx={{ mb: 2 }}>
        Add Timeline Entry
      </Button>

      {/* Password */}
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        error={!!errors.password}
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
          py: 5
        }}
      >
        {errors.image && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errors.image}
          </Typography>
        )}
        <Button
          variant="contained"
          component="label"
          sx={{ mb: 2, display: 'block' }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>
        {preview && (
          <Avatar
            src={preview}
            alt="Preview"
            sx={{ width: 100, height: 100, mb: 2 }}
          />
        )}
      </Box>

      {/* Submit */}
      <Button 
        variant="contained" 
        onClick={handleSubmit}
        disabled={rolesLoading || !!rolesError}
      >
        {rolesLoading ? <CircularProgress size={24} /> : 'Register'}
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