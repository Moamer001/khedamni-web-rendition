
import React from 'react';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  color: 'green' | 'orange' | 'blue' | 'yellow';
}

const StepCard = ({ number, title, description, color }: StepCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return 'bg-green-400 text-white';
      case 'orange':
        return 'bg-khedamni-orange text-white';
      case 'blue':
        return 'bg-khedamni-blue text-white';
      case 'yellow':
        return 'bg-yellow-400 text-gray-800';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg text-center arabic-text">
      <div className={`w-16 h-16 rounded-lg ${getColorClasses()} flex items-center justify-center text-2xl font-bold mx-auto mb-4`}>
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-3 leading-snug">
        {title}
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default StepCard;
