

// import React, { useState, useEffect } from 'react';
// import { 
//   TextField, 
//   Button, 
//   Box, 
//   Typography, 
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   CircularProgress,
//   Paper,
//   Alert,
//   Snackbar
// } from '@mui/material';
// import { Close as CloseIcon, LocationOn } from '@mui/icons-material';
// import emailjs from 'emailjs-com';
// import axios from 'axios';
// import { API_BASE_URL } from '../config';

// const SERVICE_ID = 'service_jcbc57t';
// const TEMPLATE_ID = 'template_wx5j9ln';
// const PUBLIC_KEY = '5w-pZKaslwts0P7au';

// const ContactForm = () => {
//   const [formData, setFormData] = useState({ name: '', email: '', message: '' });
//   const [error, setError] = useState(null);
//   const [addressModalOpen, setAddressModalOpen] = useState(false);
//   const [existingData, setExistingData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const token = localStorage.getItem('token');

//   const handleError = (err) => {
//     const message = err.response?.data?.message || err.message || 'An error occurred';
//     setError({ type: 'error', message });
//   };

//   const fetchAddress = async () => {
//     setLoading(true);
//     try {
//       if (!token) throw new Error('Authentication required');
//       const res = await axios.get(`${API_BASE_URL}/api/address`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const data = Array.isArray(res.data) ? res.data[0] || null : res.data;
//       setExistingData(data);
//     } catch (err) {
//       handleError(err);
//       setAddressModalOpen(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (addressModalOpen && !existingData) {
//       fetchAddress();
//     }
//   }, [addressModalOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const { name, email, message } = formData;

//     if (!name || !email || !message) {
//       setError({ 
//         type: 'error', 
//         message: 'Please fill in all required fields' 
//       });
//       return;
//     }

//     try {
//       const templateParams = {
//         from_name: name,
//         from_email: email,
//         message: message
//       };

//       await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
//       setError({
//         type: 'success',
//         message: `Thank you for reaching out, ${name}! We'll get back to you soon.`
//       });
//       setFormData({ name: '', email: '', message: '' });
//     } catch (err) {
//       handleError(err);
//     }
//   };

//   const AddressModal = () => (
//     <Dialog
//       open={addressModalOpen}
//       onClose={() => setAddressModalOpen(false)}
//       maxWidth="sm"
//       fullWidth
//       BackdropProps={{
//         sx: {
//           backgroundColor: 'rgba(0, 0, 0, 0.8)',
//           backdropFilter: 'blur(4px)'
//         }
//       }}
//     >
//       <DialogTitle sx={{ 
//         display: 'flex', 
//         justifyContent: 'space-between', 
//         alignItems: 'center',
//         bgcolor: 'primary.main',
//         color: 'white'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <LocationOn />
//           <Typography variant="h6">Our Address</Typography>
//         </Box>
//         <IconButton
//           onClick={() => setAddressModalOpen(false)}
//           sx={{ color: 'white' }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent sx={{ mt: 2 }}>
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//             <CircularProgress />
//           </Box>
//         ) : existingData ? (
//           <Paper elevation={0} sx={{ p: 3, backgroundColor: '#f8f8f8' }}>
//             <Typography variant="body1" paragraph>
//               {existingData.department && `${existingData.department}`}
//               {existingData.room && `, Room ${existingData.room}`}
//             </Typography>
//             <Typography variant="body1" paragraph>
//               {existingData.institution}
//             </Typography>
//             <Typography variant="body1" paragraph>
//               {existingData.city}
//               {existingData.state && `, ${existingData.state}`} {existingData.postalCode}
//             </Typography>
//             <Typography variant="body1">
//               {existingData.country}
//             </Typography>
//           </Paper>
//         ) : (
//           <Typography color="error">
//             Address information not available
//           </Typography>
//         )}
//       </DialogContent>
//     </Dialog>
//   );

//   return (
//     <Box id="contact-section" sx={{ py: 5, px: { xs: 2, md: 5 }, backgroundColor: '#f5f5f5' }}>
//       <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
//         Contact Us
//       </Typography>

//       <Snackbar 
//         open={!!error} 
//         autoHideDuration={6000} 
//         onClose={() => setError(null)}
//         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setError(null)} 
//           severity={error?.type || 'error'} 
//           sx={{ width: '100%' }}
//         >
//           {error?.message}
//         </Alert>
//       </Snackbar>

//       <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
//         <Button
//           variant="outlined"
//           startIcon={<LocationOn />}
//           onClick={() => setAddressModalOpen(true)}
//           sx={{ 
//             borderRadius: 2,
//             textTransform: 'none',
//             px: 3
//           }}
//         >
//           View Our Address
//         </Button>
//       </Box>
//       <TextField
//         label="Name"
//         name="name"
//         value={formData.name}
//         onChange={handleChange}
//         required
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         required
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <TextField
//         label="Message"
//         name="message"
//         value={formData.message}
//         onChange={handleChange}
//         required
//         multiline
//         rows={4}
//         fullWidth
//         sx={{ mb: 2 }}
//       />
//       <Button 
//         variant="contained" 
//         onClick={handleSubmit} 
//         sx={{ display: 'block', mx: 'auto' }}
//       >
//         Submit
//       </Button>
//       <AddressModal />
//     </Box>
//   );
// };

// export default ContactForm;

import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Paper,
  Alert,
  Snackbar,
  Grid
} from '@mui/material';
import { Close as CloseIcon, LocationOn } from '@mui/icons-material';
import emailjs from 'emailjs-com';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const SERVICE_ID = 'service_jcbc57t';
const TEMPLATE_ID = 'template_wx5j9ln';
const PUBLIC_KEY = '5w-pZKaslwts0P7au';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [existingData, setExistingData] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleError = (err) => {
    const message = err.response?.data?.message || err.message || 'An error occurred';
    setError({ type: 'error', message });
  };

  const fetchAddress = async () => {
    setLoading(true);
    try {
      // if (!token) throw new Error('Authentication required');
      const res = await axios.get(`${API_BASE_URL}/api/address`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(res.data) ? res.data[0] || null : res.data;
      setExistingData(data);
    } catch (err) {
      handleError(err);
      setAddressModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (addressModalOpen && !existingData) {
      fetchAddress();
    }
  }, [addressModalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError({ 
        type: 'error', 
        message: 'Please fill in all required fields' 
      });
      return;
    }

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setError({
        type: 'success',
        message: `Thank you for reaching out, ${name}! We'll get back to you soon.`
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      handleError(err);
    }
  };

  const AddressField = ({ label, value }) => (
    value ? (
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
          <Typography 
            component="span" 
            sx={{ 
              fontWeight: 600, 
              color: 'primary.main',
              minWidth: '120px',
              fontSize: '0.95rem'
            }}
          >
            {label}:
          </Typography>
          <Typography 
            component="span"
            sx={{ 
              fontSize: '1rem',
              color: 'text.primary' 
            }}
          >
            {value}
          </Typography>
        </Box>
      </Grid>
    ) : null
  );

  const AddressModal = () => (
    <Dialog
      open={addressModalOpen}
      onClose={() => setAddressModalOpen(false)}
      maxWidth="sm"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(4px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        bgcolor: 'primary.main',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn />
          <Typography variant="h6">Our Address</Typography>
        </Box>
        <IconButton
          onClick={() => setAddressModalOpen(false)}
          sx={{ color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : existingData ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              backgroundColor: '#f8f8f8',
              borderRadius: 2
            }}
          >
            <Grid container spacing={2}>
              <AddressField label="Room" value={existingData.room} />
              <AddressField label="Department" value={existingData.department} />
              <AddressField label="Institution" value={existingData.institution} />
              <AddressField label="City" value={existingData.city} />
              <AddressField label="State" value={existingData.state} />
              <AddressField label="Postal Code" value={existingData.postalCode} />
              <AddressField label="Country" value={existingData.country} />
            </Grid>
          </Paper>
        ) : (
          <Typography color="error">
            Address information not available
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <Box id="contact-section" sx={{ py: 5, px: { xs: 2, md: 5 }, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Contact Us
      </Typography>

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

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<LocationOn />}
          onClick={() => setAddressModalOpen(true)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            px: 3
          }}
        >
          View Our Address
        </Button>
      </Box>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button 
        variant="contained" 
        onClick={handleSubmit} 
        sx={{ display: 'block', mx: 'auto' }}
      >
        Submit
      </Button>
      <AddressModal />
    </Box>
  );
};

export default ContactForm;