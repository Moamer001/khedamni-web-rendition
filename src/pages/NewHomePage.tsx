
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Home as HomeIcon, Settings, Star, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCraftsmen } from '@/hooks/useCraftsmen';
import { useCategories } from '@/hooks/useCategories';
import { useCities } from '@/hooks/useCities';
import { useAuth } from '@/hooks/useAuth';

const NewHomePage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { data: craftsmen, isLoading: craftsmenLoading } = useCraftsmen();
  const { data: categories } = useCategories();
  const { data: cities } = useCities();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('كهرباء');
  const [selectedCity, setSelectedCity] = useState('');

  // Filter out items with empty or invalid IDs
  const validCities = cities?.filter(city => city.id && city.id.trim() !== '') || [];
  const validCategories = categories?.filter(category => category.id && category.id.trim() !== '') || [];

  const filteredCraftsmen = craftsmen?.filter(craftsman => {
    const matchesSearch = searchTerm === '' || 
      craftsman.profiles.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      craftsman.profiles.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      craftsman.categories.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || craftsman.category_id === selectedCategory;
    const matchesCity = selectedCity === '' || selectedCity === 'all' || craftsman.profiles.cities?.name === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="bg-khedamni-blue min-h-screen flex flex-col" dir="rtl">
      {/* Header - Same as HomePage */}
      <nav className="bg-[#202c76] border-b-4 border-[#f3b12d] py-3 px-3 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/profile" className="flex flex-col items-center group text-white hover:text-[#f3b12d]">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">حسابي</span>
          </Link>
          <Link to="/new-home" className="flex flex-col items-center group text-[#f3b12d]">
            <HomeIcon className="w-6 h-6 mb-1 fill-[#f3b12d]" />
            <span className="text-xs font-bold">الرئيسية</span>
          </Link>
        </div>
        {/* Logo */}
        <div className="text-white text-xl md:text-2xl font-bold leading-tight ml-2">
          <span className="text-[#f3b12d]">K</span>hedamni
        </div>
      </nav>

      {/* Search section - Same design as HomePage */}
      <div className="px-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-3 text-right">ما الذي تبحث عنه اليوم؟</h1>
          
          {/* Search, City, Category */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            {/* Search */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="بحث"
                className="w-full rounded-xl px-12 py-3 pr-4 bg-white text-gray-800 placeholder:text-gray-400 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none"
                dir="rtl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            
            {/* City */}
            <select
              className="rounded-xl px-6 py-3 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none min-w-[140px]"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              dir="rtl"
            >
              <option value="">اختر المدينة</option>
              {validCities.map((city) => (
                <option key={city.id} value={city.name}>{city.name}</option>
              ))}
            </select>
            
            {/* Category */}
            <div className="relative">
              <select
                className="rounded-xl px-8 py-3 bg-white text-gray-800 font-medium focus:ring-2 focus:ring-[#f3b12d] outline-none min-w-[140px] appearance-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                dir="rtl"
              >
                {validCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* White section with categories and craftsmen */}
      <div className="bg-white rounded-t-3xl py-7 px-4 md:px-6 mt-auto">
        {/* Categories */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
          <h2 className="text-[#202c76] text-xl font-bold">الفئات</h2>
          <Link to="/categories" className="text-[#202c76] text-sm underline font-medium hover:text-[#f3b12d]">عرض الكل</Link>
        </div>
        
        <div className="max-w-3xl mx-auto overflow-x-auto flex gap-3 pb-2 mb-8">
          {validCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex flex-col items-center justify-center min-w-[100px] py-4 px-3 rounded-xl border-2 transition font-semibold
                ${selectedCategory === cat.name ? "bg-[#f3b12d]/10 border-[#f3b12d] text-[#202c76]" : "bg-gray-50 border-gray-200 text-gray-500 hover:border-[#f3b12d]"}`}
            >
              <div className="mb-2 w-6 h-6">⚡</div>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Craftsmen Results */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#202c76] text-xl font-bold">الحرفيين</h2>
          </div>
          
          {craftsmenLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#202c76] mx-auto"></div>
              <p className="mt-4 text-gray-600">جاري تحميل الحرفيين...</p>
            </div>
          ) : filteredCraftsmen && filteredCraftsmen.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {filteredCraftsmen.map((craftsman) => (
                <div
                  key={craftsman.id}
                  onClick={() => navigate(`/craftsman/${craftsman.id}`)}
                  className="flex flex-col items-center bg-white border border-gray-200 rounded-xl px-4 py-6 min-w-[140px] shadow hover:shadow-md transition cursor-pointer"
                >
                  <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-[#f3b12d] mb-3">
                    {craftsman.profiles.avatar_url ? (
                      <img 
                        src={craftsman.profiles.avatar_url} 
                        alt={`${craftsman.profiles.first_name} ${craftsman.profiles.last_name}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#f3b12d]/20 flex items-center justify-center">
                        <span className="text-[#202c76] font-bold text-lg">
                          {craftsman.profiles.first_name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-[#202c76] font-semibold mb-1 text-center">
                    {craftsman.profiles.first_name} {craftsman.profiles.last_name}
                  </div>
                  <div className="text-xs text-gray-400 mb-1">{craftsman.categories.name}</div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < craftsman.rating ? "fill-[#f3b12d] text-[#f3b12d]" : "text-gray-200"}
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                  {craftsman.profiles.phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`tel:${craftsman.profiles.phone}`);
                      }}
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">لا توجد نتائج</div>
              <p className="text-gray-400">جرب تغيير معايير البحث</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewHomePage;
