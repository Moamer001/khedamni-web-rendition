
import React from 'react';
import ToolboxIllustration from './ToolboxIllustration';

const HeroSection = () => {
  return (
    <main className="relative flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Content Section */}
        <div className="text-center lg:text-right arabic-text animate-fade-in">
          <h1 className="hero-title text-khedamni-white mb-6 leading-tight">
            خدمني: الموقع الذي يربط بين العملاء و المستخدمين المهرة
          </h1>
          
          <div className="space-y-4 mb-8">
            <h2 className="hero-subtitle text-khedamni-white opacity-90">
              هل لديك أعمال ؟
            </h2>
            <h2 className="hero-subtitle text-khedamni-white opacity-90">
              أنت حرفي و تريد تقديم خدماتك ؟
            </h2>
          </div>
          
          <p className="hero-subtitle text-khedamni-white opacity-80 mb-8 max-w-xl mx-auto lg:mx-0">
            خدمني أتت بالحل ! خير منصة تربط بين العملاء و الحرفيين، لإنجاز الخدمات بسهولة و شفافية !
          </p>
          
          <div className="space-y-3">
            <button className="bg-khedamni-orange hover:bg-orange-500 text-khedamni-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
              سجل الآن
            </button>
            <p className="text-khedamni-white opacity-70 text-sm">
              و اكتشف خدماتنا !
            </p>
          </div>
        </div>

        {/* Illustration Section */}
        <div className="flex justify-center lg:justify-start">
          <ToolboxIllustration />
        </div>
      </div>
    </main>
  );
};

export default HeroSection;
