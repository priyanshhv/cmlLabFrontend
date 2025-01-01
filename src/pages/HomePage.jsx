// pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PublicationsSection from '../components/PublicationsSection';
import ContactForm from '../components/ContactForm';
import TeamSection from '../components/TeamSection';

const HomePage = () => (
    <>
        <HeroSection />
        <AboutSection />
        <TeamSection/>
        <PublicationsSection />
        <ContactForm />
    </>
);

export default HomePage;