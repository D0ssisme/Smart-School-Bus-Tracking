// src/components/LanguageSwitcher.jsx
import { useState, useEffect, useRef } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const languages = [
    {
      code: 'vi',
      name: 'Tiếng Việt',
      nativeName: 'Vietnamese',
      flag: '🇻🇳'
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'Anh',
      flag: '🇬🇧'
    }
  ];

  const currentLang = languages.find(lang => lang.code === language);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-200 shadow-sm hover:shadow-md"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-blue-700 uppercase text-sm">
          {currentLang?.code}
        </span>
        <svg
          className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">
              Select Language
            </div>
            
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-3 rounded-lg text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-150 flex items-center gap-3 group ${
                  language === lang.code
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm'
                    : ''
                }`}
              >
                <span className="text-3xl">{lang.flag}</span>
                
                <div className="flex-1">
                  <div className={`font-semibold ${
                    language === lang.code ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {lang.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {lang.nativeName}
                  </div>
                </div>
                
                {language === lang.code && (
                  <Check className="w-5 h-5 text-blue-600" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>

          {/* Optional: Add more languages hint */}
          <div className="border-t border-gray-100 px-3 py-2 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              More languages coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  );
}