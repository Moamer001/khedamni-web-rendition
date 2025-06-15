import React, { useState } from "react";
import { Search, User, Home as HomeIcon, Map, Star, CircleUser, PaintRoller, Wrench, Droplets, Hammer, Bolt, Building2, Palette, Settings } from "lucide-react";
import { Link } from "react-router-dom";

// بيانات المدن والفئات والنجارين (مؤقتة)
const cities = [
  "طرابلس",
  "بنغازي",
  "مصراتة",
  "سبها",
];

const categories = [
  { title: "كهرباء", icon: <Bolt className="w-6 h-6" /> },
  { title: "بناء", icon: <Building2 className="w-6 h-6" /> },
  { title: "دهان", icon: <PaintRoller className="w-6 h-6" /> },
  { title: "سباكة", icon: <Droplets className="w-6 h-6" /> },
  { title: "نجارة", icon: <Hammer className="w-6 h-6" /> },
];

const craftsmen = [
  {
    id: "1",
    name: "محمد جمال",
    category: "كهرباء",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    rating: 5,
  },
  {
    id: "2",
    name: "سالم حسين",
    category: "دهان",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
    rating: 4,
  },
  {
    id: "3",
    name: "أحمد علي",
    category: "سباكة",
    img: "https://randomuser.me/api/portraits/men/77.jpg",
    rating: 5,
  },
  {
    id: "4",
    name: "سارة عبدو",
    category: "بناء",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    rating: 4,
  },
];

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("كهرباء");
  const [selectedCity, setSelectedCity] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="bg-khedamni-blue min-h-screen flex flex-col" dir="rtl">
      {/* Header */}
      <nav className="bg-[#202c76] border-b-4 border-[#f3b12d] py-3 px-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/profile" className="flex flex-col items-center group text-[#f3b12d]">
            <User className="w-6 h-6 mb-1 fill-[#f3b12d]" />
            <span className="text-xs font-bold">حسابي</span>
          </Link>
          <Link to="/home" className="flex flex-col items-center group text-white hover:text-[#f3b12d]">
            <HomeIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">الرئيسية</span>
          </Link>
        </div>
        {/* Logo */}
        <div className="text-white text-xl md:text-2xl font-bold leading-tight ml-2">
          <span className="text-[#f3b12d]">K</span>hedamni
        </div>
      </nav>
      {/* Search section */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 text-right">ما الذي تبحث عنه اليوم؟</h1>
          {/* بحث ومدينتك والفئة */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* بحث */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="بحث"
                className="w-full rounded-xl px-12 py-3 pr-4 bg-white text-gray-800 placeholder:text-gray-400 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none"
                dir="rtl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {/* المدينة */}
            <select
              className="rounded-xl px-6 py-3 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none min-w-[140px]"
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              dir="rtl"
            >
              <option value="">اختر المدينة</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {/* الفئة */}
            <div className="relative">
              <select
                className="rounded-xl px-8 py-3 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none min-w-[140px] appearance-none"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                dir="rtl"
              >
                {categories.map(cat => (
                  <option key={cat.title} value={cat.title}>{cat.title}</option>
                ))}
              </select>
              {/* أيقونة التروس */}
              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      {/* Categories section */}
      <div className="bg-white rounded-t-3xl py-7 px-4 md:px-6 mt-auto">
        {/* الفئات */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
          <h2 className="text-[#202c76] text-xl font-bold">الفئات</h2>
          <Link to="/categories" className="text-[#202c76] text-sm underline font-medium hover:text-[#f3b12d]">عرض الكل</Link>
        </div>
        <div className="max-w-3xl mx-auto overflow-x-auto flex gap-3 pb-2">
          {categories.map(cat => (
            <button
              key={cat.title}
              onClick={() => setSelectedCategory(cat.title)}
              className={`flex flex-col items-center justify-center min-w-[100px] py-4 px-3 rounded-xl border-2 transition font-semibold
                ${selectedCategory === cat.title ? "bg-[#f3b12d]/10 border-[#f3b12d] text-[#202c76]" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f3b12d]"}`}
            >
              <div className="mb-2">{cat.icon}</div>
              <span>{cat.title}</span>
            </button>
          ))}
        </div>
        {/* الحرفيين */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#202c76] text-xl font-bold">الحرفيين</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {craftsmen
              .filter(cr => cr.category === selectedCategory || selectedCategory === "")
              .map(cr => (
                <a
                  key={cr.id}
                  href={`/craftsman/${cr.id}`}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl px-4 py-6 min-w-[140px] shadow hover:shadow-md transition cursor-pointer"
                  style={{ textDecoration: "none" }}
                >
                  <img src={cr.img} alt={cr.name} className="w-14 h-14 object-cover rounded-full border-2 border-[#f3b12d] mb-3" />
                  <div className="text-[#202c76] font-semibold mb-1">{cr.name}</div>
                  <div className="text-xs text-gray-400 mb-1">{cr.category}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < cr.rating ? "fill-[#f3b12d] text-[#f3b12d]" : "text-gray-200"}
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
