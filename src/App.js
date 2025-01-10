//App.js
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner'; // Create a spinner component
import { login } from './redux/userSlice';
import NotFound from './components/NotFound';

// Lazy-loaded components
const HomePage = React.lazy(() => import('./pages/HomePage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserPage = React.lazy(() => import('./pages/UserPage'));
const LoginForm = React.lazy(() => import('./components/LoginForm'));
const RegisterForm = React.lazy(() => import('./components/RegisterForm'));
const PublicationForm = React.lazy(() => import('./components/PublicationForm'));
const Footer = React.lazy(() => import('./components/Footer'));
const UserDetailPage = React.lazy(() => import('./pages/UserDetailPage')); 
const PublicationPage = React.lazy(() => import('./pages/PublicationPage')); 
const ResourcePage = React.lazy(() => import('./pages/Resource')); 
const ProfileUpdatePage = React.lazy(() => import('./pages/ProfileUpdateForm')); // <-- new line


const App = () => {
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(login({ user: JSON.parse(localStorage.getItem('user')), token }));
        }
    }, [dispatch]);

    return (
        <Router>
            <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh', 
        // ensures the container will fill the vertical space
      }}
    >
            <Navbar />
             <Box component="main" sx={{ flex: 1 }}>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginForm />} />
                     <Route path="/users/:id" element={<UserDetailPage />} />
                     <Route path="/publication" element={<PublicationPage />} />
                     <Route path="/resource" element={<ResourcePage />} />
                    <Route path="/register" element={<RegisterForm />} />
                    {isLoggedIn && (
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<UserPage />} />
                            <Route path="/update/profile" element={<ProfileUpdatePage />} />
                            <Route path="/add-publication" element={<PublicationForm />} />
                        </>
                    )}
                    <Route path="*" element={<NotFound/>} />
                </Routes>
            </Suspense>
            </Box>
            <Footer/>
            </Box>
        </Router>
    );
};

export default App;
