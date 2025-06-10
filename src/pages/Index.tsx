
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import GoalSection from '../components/GoalSection';
import UsersSection from '../components/UsersSection';
import BackgroundShapes from '../components/BackgroundShapes';

const Index = () => {
  return (
    <div className="min-h-screen bg-khedamni-blue relative overflow-hidden">
      {/* Background shapes */}
      <BackgroundShapes />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <HeroSection />
        <AboutSection />
        <GoalSection />
        <UsersSection />
      </div>
    </div>
  );
};

export default Index;
