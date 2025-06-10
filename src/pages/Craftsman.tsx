
import React from 'react';
import Header from '../components/Header';
import StepCard from '../components/StepCard';

const Craftsman = () => {
  const craftmanSteps = [
    {
      number: 1,
      title: 'قم بالتسجيل وانشاء حساب',
      description: 'قم بانشاء حساب واضف معلوماتك الأساسية لتبدء رحلتك معنا وايضا معلومات حول امحاتك المنتجة',
      color: 'green' as const
    },
    {
      number: 2,
      title: 'حدد وقت عملك',
      description: 'قم بتحديد الاوقات المختلفة التي يمكن يمكنك بهدائك واثبتك لدى للدوية',
      color: 'orange' as const
    },
    {
      number: 3,
      title: 'استقبل طلبات العمل',
      description: 'انتظر طن طلب أعمالك دوائر الاتصاحل بك منشارك للدوية ولقياسك طلبات الخدمات للحصول على اكبر كمية مرضية',
      color: 'green' as const
    },
    {
      number: 4,
      title: 'قدم الخدمة',
      description: 'انتقل الى مكان العمل و أكمل دورة مجلة الخدمة',
      color: 'blue' as const
    },
    {
      number: 5,
      title: 'احصل على التقييمات',
      description: 'سيقوم العملاء بتقييمك الخدمات المطلوبة سبسهل عتبارك الحصول على العملاء الجدد',
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

          {/* Craftsman Steps */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-12">
              أنت حرفي
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {craftmanSteps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Craftsman;
