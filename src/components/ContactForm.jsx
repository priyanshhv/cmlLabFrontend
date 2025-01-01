

// ContactForm.jsx;
import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import emailjs from 'emailjs-com'; // or '@emailjs/browser' as recommended

const SERVICE_ID = 'service_jcbc57t';
const TEMPLATE_ID = 'template_wx5j9ln';
const PUBLIC_KEY = '5w-pZKaslwts0P7au';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setError(true);
      return;
    }

    try {
      // Prepare template params (matching your EmailJS template fields)
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message
      };

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      alert(`Thank you for reaching out, ${name}! We’ll get back to you soon.`);
      setFormData({ name: '', email: '', message: '' });
      setError(false);
    } catch (err) {
      console.error('Failed to send via EmailJS:', err);
      alert('Oops! Something went wrong while sending your message.');
    }
  };

  return (
    <Box id="contact-section" sx={{ py: 5, px: { xs: 2, md: 5 }, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
        Contact Us
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={error && !formData.name}
        helperText={error && !formData.name ? 'Name is required' : ''}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={error && !formData.email}
        helperText={error && !formData.email ? 'Email is required' : ''}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={error && !formData.message}
        helperText={error && !formData.message ? 'Message is required' : ''}
        multiline
        rows={4}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ display: 'block', mx: 'auto' }}>
        Submit
      </Button>
    </Box>
  );
};

export default ContactForm;
