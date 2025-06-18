
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, MapPin, Star, Clock, Car, Home, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCraftsman } from "@/hooks/useCraftsmen";
import { useAuth } from "@/hooks/useAuth";

const NewCraftsmanDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: craftsman, isLoading, error } = useCraftsman(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]" dir="rtl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#202c76]"></div>
      </div>
    );
  }

  if (error || !craftsman) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]" dir="rtl">
        <div className="bg-white rounded-xl shadow p-6 text-center text-red-500 font-bold">
          الحرفي غير موجود
          <Button className="block mt-4 mx-auto" onClick={() => navigate("/home")}>
            رجوع
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4] pb-12" dir="rtl">
      {/* زر الرجوع */}
      <div className="relative max-w-2xl mx-auto pt-4">
        <button
          className="absolute right-2 top-2 z-10 rounded-full border bg-white w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-50 transition"
          aria-label="رجوع"
          onClick={() => navigate('/home')}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">تفاصيل الحرفي</h2>
      </div>

      {/* البيانات الرئيسية */}
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4 bg-white rounded-3xl shadow px-4 py-6 mt-4">
        {/* البطاقة + بيانات */}
        <div className="flex flex-col items-center justify-center p-2">
          <div className="w-24 h-24 mb-2">
            {craftsman.profiles.avatar_url ? (
              <img 
                src={craftsman.profiles.avatar_url} 
                alt={`${craftsman.profiles.first_name} ${craftsman.profiles.last_name}`}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#f3b12d]" 
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#f3b12d]/20 flex items-center justify-center border-2 border-[#f3b12d]">
                <span className="text-[#f3b12d] font-bold text-2xl">
                  {craftsman.profiles.first_name.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="font-bold text-lg mb-1">
            {craftsman.profiles.first_name} {craftsman.profiles.last_name}
          </div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 border rounded-lg text-xs text-[#202c76] border-[#c8c8c8]">
              {craftsman.categories.name}
            </span>
          </div>
          {craftsman.description && (
            <p className="text-gray-700 text-sm text-center mb-3">{craftsman.description}</p>
          )}
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(craftsman.rating) ? "text-[#f3b12d] fill-current" : "text-gray-200"}`} />
            ))}
            <span className="text-sm text-gray-600 mr-2">
              {craftsman.rating.toFixed(1)} ({craftsman.total_reviews} مراجعة)
            </span>
          </div>
        </div>

        {/* المعلومات العامة */}
        <div className="rounded-2xl bg-gray-50 px-4 py-3 flex flex-col gap-2">
          <div className="font-bold text-base mb-1">معلومات عامة</div>
          
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-[#f3b12d]" />
            <span>سنوات الخبرة: {craftsman.experience_years} سنة</span>
          </div>
          
          {craftsman.hourly_rate && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-[#f3b12d]" />
              <span>السعر: {craftsman.hourly_rate} د.ل/ساعة</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <Car className="w-4 h-4 text-[#f3b12d]" />
            <span>يملك سيارة: {craftsman.has_car ? 'نعم' : 'لا'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-[#f3b12d]" />
            <span>يقدم خدماته في المنزل: {craftsman.available_at_home ? 'نعم' : 'لا'}</span>
          </div>
          
          {craftsman.payment_methods && craftsman.payment_methods.length > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-[#f3b12d]" />
              <span>طرق الدفع: {craftsman.payment_methods.join(', ')}</span>
            </div>
          )}
          
          {craftsman.is_verified && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <span>✓</span>
              <span>حرفي موثق</span>
            </div>
          )}
        </div>
      </div>

      {/* جهات الاتصال */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-6 py-4 mt-5 flex flex-col gap-2">
        <div className="font-bold text-[1.1rem] mb-1">جهات الاتصال</div>
        
        {craftsman.profiles.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-[#f3b12d]" />
            <span>{craftsman.profiles.phone}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-[#f3b12d]" />
          <span>متوفر عبر النظام</span>
        </div>
        
        {craftsman.profiles.cities && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-[#f3b12d]" />
            <span>{craftsman.profiles.cities.name}</span>
          </div>
        )}
      </div>

      {/* المهارات */}
      {craftsman.skills && craftsman.skills.length > 0 && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-6 py-4 mt-5">
          <div className="font-bold mb-3">المهارات</div>
          <div className="flex flex-wrap gap-2">
            {craftsman.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-[#f3b12d]/10 text-[#202c76] rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* الأعمال السابقة */}
      {craftsman.craftsman_works && craftsman.craftsman_works.length > 0 && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-4 py-5 mt-5">
          <div className="font-bold mb-4 text-xl text-center">الأعمال السابقة</div>
          <div className="flex gap-3 justify-center items-center">
            {craftsman.craftsman_works.slice(0, 2).map((work) => (
              <div
                key={work.id}
                className="rounded-2xl overflow-hidden bg-gray-100 border min-w-[80px] h-[80px] flex items-center justify-center"
                style={{ width: '80px', height: '80px' }}
              >
                {work.image_url ? (
                  <img src={work.image_url} alt={work.title} className="object-cover w-full h-full" />
                ) : (
                  <div className="text-gray-400 text-xs text-center p-2">{work.title}</div>
                )}
              </div>
            ))}
            {craftsman.craftsman_works.length > 2 && (
              <div className="rounded-2xl overflow-hidden bg-[#4746a2]/80 text-white flex items-center justify-center font-bold text-2xl" style={{ width: '80px', height: '80px' }}>
                +{craftsman.craftsman_works.length - 2}
              </div>
            )}
          </div>
        </div>
      )}

      {/* أزرار الإجراءات */}
      {user && (
        <div className="max-w-2xl mx-auto mt-6 px-4">
          <div className="flex gap-3">
            <Button className="flex-1 bg-[#202c76] hover:bg-blue-700 text-white">
              إرسال طلب عمل
            </Button>
            <Button variant="outline" className="flex-1 border-[#202c76] text-[#202c76] hover:bg-[#202c76] hover:text-white">
              إرسال رسالة
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCraftsmanDetails;
