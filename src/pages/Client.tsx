
import React from 'react';
import Header from '../components/Header';
import StepCard from '../components/StepCard';

const Client = () => {
  const clientSteps = [
    {
      number: 1,
      title: 'سجل نفسك',
      description: 'ابدأ رحلتك معنا من خلال إنشاء حساب بسيط الخطوة على موقعنا الرسمي',
      color: 'green' as const
    },
    {
      number: 2,
      title: 'ابحث عن خدمة',
      description: 'اختيار الخدمة المطلوبة التي تناسب احتياجاتك، مع الحرفيين المؤهلين أو التقييم أخرى',
      color: 'orange' as const
    },
    {
      number: 3,
      title: 'حدد حرفي',
      description: 'اختيار أفضل حرفي مناسب واحصلائه وتقييمه وحجابته واستطل مهارفة من النحل الذي فجم بنجاحه على النحل',
      color: 'green' as const
    },
    {
      number: 4,
      title: 'قم بتطبيط الخدمة',
      description: 'قم بإضافة العوامل إلى قابوسة الخدمات الإدارية بالتفصيل',
      color: 'blue' as const
    },
    {
      number: 5,
      title: 'استلم الفدعان وشارك تعليقك',
      description: 'بعد تلقي الخدمة، قم بمراجع السعر أضادة أو تعليقانك على الخدمة التى كنت أتلقيتها مع تقييم الحرفي أو أعمله',
      color: 'yellow' as const
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-16 px-6">
        <div className="max-w-6xl mx-auto arabic-text">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              الخطوات لإستعمال المنصة
            </h1>
            <p className="text-gray-600">
              استخدام خدمني بسيط واسهل، اتبع الخطوات أدناه
            </p>
            <p className="text-gray-600">
              و استمتع بالخدمات و حلول مشكلاتك بسهولة
            </p>
          </div>

          {/* Client Steps */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
              أنت تبحث حرفي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clientSteps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;
