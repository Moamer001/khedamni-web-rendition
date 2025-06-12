
import React from 'react';
import { User, Map, House, Wrench, Search, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: House, label: 'الصفحة الرئيسية', href: '/' },
    { icon: Map, label: 'الخطوات', href: '/steps' },
    { icon: Wrench, label: 'أنت حرفي', href: '/craftsman' },
    { icon: Search, label: 'أنت تبحث حرفي', href: '/client' },
    { icon: User, label: 'حسابي', href: '/account' }
  ];

  return (
    <header className="relative z-10 px-4 md:px-6 py-3 md:py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Navigation Items - Desktop */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 space-x-reverse">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center space-x-2 space-x-reverse transition-colors duration-300 group ${
                location.pathname === item.href 
                  ? 'text-khedamni-orange' 
                  : 'text-khedamni-white hover:text-khedamni-orange'
              }`}
            >
              <item.icon className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium text-sm xl:text-base">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Navigation - Simplified */}
        <div className="flex lg:hidden items-center space-x-4 space-x-reverse">
          <Link
            to="/steps"
            className={`flex items-center space-x-1 space-x-reverse transition-colors duration-300 ${
              location.pathname === '/steps' 
                ? 'text-khedamni-orange' 
                : 'text-khedamni-white hover:text-khedamni-orange'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-sm font-medium">الخطوات</span>
          </Link>
          <Link
            to="/craftsman"
            className={`flex items-center space-x-1 space-x-reverse transition-colors duration-300 ${
              location.pathname === '/craftsman' 
                ? 'text-khedamni-orange' 
                : 'text-khedamni-white hover:text-khedamni-orange'
            }`}
          >
            <Wrench className="w-5 h-5" />
            <span className="text-sm font-medium">حرفي</span>
          </Link>
          <Link
            to="/client"
            className={`flex items-center space-x-1 space-x-reverse transition-colors duration-300 ${
              location.pathname === '/client' 
                ? 'text-khedamni-orange' 
                : 'text-khedamni-white hover:text-khedamni-orange'
            }`}
          >
            <Search className="w-5 h-5" />
            <span className="text-sm font-medium">عميل</span>
          </Link>
        </div>

        {/* Logo - Right side */}
        <Link to="/" className="flex items-center">
          <div className="text-khedamni-white text-xl md:text-2xl font-bold">
            <span className="text-khedamni-orange">K</span>hedamni
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
