// pages/HomePage.jsx
import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import PublicationsSection from '../components/PublicationsSection';
import ContactForm from '../components/ContactForm';
import TeamSection from '../components/TeamSection';
import NewsSection from '../components/NewsSection';

const HomePage = () => (
    <>
        <HeroSection />
        <AboutSection />
        <TeamSection/>
        <PublicationsSection />
        <NewsSection />
        <ContactForm />
    </>
);

export default HomePage;