
import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import BackgroundShapes from '../components/BackgroundShapes';

const Index = () => {
  return (
    <div className="min-h-screen bg-khedamni-blue relative overflow-hidden">
      {/* Background shapes */}
      <BackgroundShapes />
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header />
        <HeroSection />
      </div>
    </div>
  );
};

export default Index;
