
import React from 'react';

const AboutSection = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Phone illustration */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-64 h-96 bg-gray-100 rounded-3xl border-8 border-gray-800 flex items-center justify-center">
                <div className="text-khedamni-blue text-6xl font-bold">K</div>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-8 -left-8 w-16 h-16 border-4 border-khedamni-orange rounded-full opacity-30"></div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 border-4 border-khedamni-orange rounded-full opacity-20"></div>
              <div className="absolute top-1/2 -right-12 w-12 h-12 border-4 border-khedamni-orange rounded-full opacity-40"></div>
            </div>
          </div>

          {/* Content */}
          <div className="text-right arabic-text">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              معلومات عنا
              <div className="w-16 h-1 bg-khedamni-orange mt-2 mr-auto"></div>
            </h2>
            
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                خدمني في منصة متقدمة تربط المستخدمين المحترفين الذين لديهم الخبرات بسهولة وعلى
              </p>
              <p>
                تمكن الخدمة العملاء من تقييم الخدمة التي تلقوها من الحرفي، البناء، المستشارين والمقاولين، فلديك
              </p>
              <p>
                كما يمكن للعمال المتخرجين من البحث عن عمل محدود المنطقة المطلوبة عن العمل أكبر فرصهم في بلاد،
              </p>
              <p>
                معاهد أو مزاود من مهاراتهم في أعمال معاهدة
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
