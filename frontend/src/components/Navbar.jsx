import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-blue-800 shadow-lg' : 'bg-blue-900 shadow-md'
      }`}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg">
            <img
              src="/icon/bus.png"
              alt="Bus Icon"
              className="w-6 h-6"
            />
          </div>
          <h3 className="text-2xl font-bold text-white group-hover:text-gray-300 transition">
            Smart School Bus
          </h3>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="relative text-white hover:text-gray-300 transition font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Trang chủ
          </Link>
          <Link
            to=""
            className="relative text-white hover:text-gray-300 transition font-medium after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            Liên hệ
          </Link>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-white text-blue-900 rounded-lg hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
          >
            Đăng nhập
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;