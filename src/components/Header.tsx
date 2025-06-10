
import React from 'react';
import { User, Map, House } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: House, label: 'الصفحة الرئيسية', href: '/' },
    { icon: Map, label: 'الخطوات', href: '/steps' },
    { icon: User, label: 'حسابي', href: '/account' }
  ];

  return (
    <header className="relative z-10 px-6 py-4">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Navigation Items - Left side */}
        <div className="flex items-center space-x-8 space-x-reverse">
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
              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Logo - Right side */}
        <Link to="/" className="flex items-center">
          <div className="text-khedamni-white text-2xl font-bold">
            <span className="text-khedamni-orange">K</span>hedamni
          </div>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
