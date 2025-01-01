import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import axiosInstance from '../axiosInstance';
import { login } from '../redux/userSlice';
import { API_BASE_URL } from '../config';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async () => {
        setError('');
        if (!formData.email || !formData.password) {
            setError('Both email and password are required');
            return;
        }

        setLoading(true);
        try {
            const res = await axiosInstance.post(`${API_BASE_URL}/api/users/login`, formData);
            const { token, user } = res.data;
            dispatch(login({ user, token }));
            localStorage.setItem('token', token);
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ py: 5, px: { xs: 2, md: 5 } }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Login
            </Typography>
            {error && (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}
            <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button
                variant="contained"
                onClick={handleLogin}
                disabled={loading}
                sx={{ display: 'block', mx: 'auto', width: '100%' }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
        </Box>
    );
};

export default LoginForm;
