
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mail, Phone, MapPin, DollarSign } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

// ديمو للبيانات، في مشروع فعلي تُجلب البيانات بناءً على id
const demoCraftsmen = [
  {
    id: "1",
    name: "mohamed ghoumah",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    category: "تكييف و تبريد",
    desc: "تركيب أنظمة التدفئة . تركيب و إصلاح مكيفات الهواء",
    details: {
      experience: "10",
      gender: "رجل",
      age: "25",
      car: "نعم",
      atHome: "نعم",
      payment: "نقدي",
    },
    contact: {
      phone: "0900000000",
      email: "mohamedghuoma@gmail.com",
      city: "طرابلس",
    },
    about: "خبير محترف في أنظمة التكييف والتبريد بجودة وكفاءة عالية",
    rate: 5,
    works: [
      { img: "https://images.unsplash.com/photo-1527576539890-dfa815648363?auto=format&fit=facearea&w=400&h=400", name: "عمل 1" },
      { img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=facearea&w=400&h=400", name: "عمل 2" },
      { img: "/lovable-uploads/4a21cf4d-60a7-403b-8e5d-f59a984d545d.png", name: "عمل 3" },
    ]
  }
];

const labelIconStyle = "inline-block align-text-bottom ml-1 text-[#f3b12d]";
const labelStyle = "mb-2 flex items-center gap-1 text-sm";

const CraftsmanDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // find craftsman by id, fallback for demo
  const craftsman = demoCraftsmen.find(cr => cr.id === id) || demoCraftsmen[0];

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
        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">تفاصيل لحرفي</h2>
      </div>
      {/* البيانات الرئيسية */}
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-4 bg-white rounded-3xl shadow px-4 py-6 mt-4">
        {/* البطاقة + بيانات */}
        <div className="flex flex-col items-center justify-center p-2">
          <Avatar className="w-24 h-24 mb-2">
            <img src={craftsman.img} alt={craftsman.name} className="w-24 h-24 rounded-full object-cover border-2 border-[#f3b12d]" />
          </Avatar>
          <div className="font-bold text-lg mb-1">{craftsman.name}</div>
          <div className="mb-2">
            <span className="inline-block px-3 py-1 border rounded-lg text-xs text-[#202c76] border-[#c8c8c8]">{craftsman.category}</span>
          </div>
          <p className="text-gray-700 text-sm text-center mb-3">{craftsman.desc}</p>
          <div className="flex gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < craftsman.rate ? "text-[#f3b12d]" : "text-gray-200"}>★</span>
            ))}
          </div>
        </div>

        {/* المعلومات العامة */}
        <div className="rounded-2xl bg-gray-50 px-4 py-3 flex flex-col gap-2">
          <div className="font-bold text-base mb-1">معلومات عامة</div>
          <div className={labelStyle}><span>سنوات الخبرة: {craftsman.details.experience} سنة</span> <span className={labelIconStyle}>📅</span></div>
          <div className={labelStyle}><span>الجنس: {craftsman.details.gender}</span> <span className={labelIconStyle}>⚥</span></div>
          <div className={labelStyle}><span>العمر: {craftsman.details.age}</span> <span className={labelIconStyle}>🎂</span></div>
          <div className={labelStyle}><span>هل تنتقل بالسيارة: {craftsman.details.car}</span> <span className={labelIconStyle}>🚗</span></div>
          <div className={labelStyle}><span>يقدم خدماته في المنزل: {craftsman.details.atHome}</span> <span className={labelIconStyle}>🏠</span></div>
          <div className={labelStyle}><span>طريقة طرق: {craftsman.details.payment}</span> <span className={labelIconStyle}>💵</span></div>
        </div>
      </div>

      {/* جهات الاتصال */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-6 py-4 mt-5 flex flex-col gap-2">
        <div className="font-bold text-[1.1rem] mb-1">جهات الاتصال</div>
        <div className={labelStyle}><Phone className={labelIconStyle} /> {craftsman.contact.phone}</div>
        <div className={labelStyle}><Mail className={labelIconStyle} /> {craftsman.contact.email}</div>
        <div className={labelStyle}><MapPin className={labelIconStyle} /> {craftsman.contact.city}</div>
      </div>

      {/* وصف الحرفي */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-6 py-4 mt-5">
        <div className="font-bold mb-1">عن الحرفي</div>
        <div className="text-gray-700">{craftsman.about}</div>
      </div>

      {/* الأعمال السابقة */}
      <div className="max-w-2xl mx-auto rounded-3xl bg-white shadow px-4 py-5 mt-5">
        <div className="font-bold mb-4 text-xl text-center">الأعمال السابقة</div>
        <div className="flex gap-3 justify-center items-center">
          {craftsman.works.slice(0,2).map((work, idx) => (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden bg-gray-100 border min-w-[80px] h-[80px] flex items-center justify-center"
              style={{ width: '80px', height: '80px' }}
            >
              <img src={work.img} alt={work.name} className="object-cover w-full h-full" />
            </div>
          ))}
          {/* مربع زيادة العدد */}
          <div className="rounded-2xl overflow-hidden bg-[#4746a2]/80 text-white flex items-center justify-center font-bold text-2xl" style={{ width: '80px', height: '80px' }}>
            +{craftsman.works.length - 2}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CraftsmanDetails;

