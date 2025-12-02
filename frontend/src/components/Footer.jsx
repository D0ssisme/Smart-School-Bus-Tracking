import React from "react";
import { Link } from "react-router-dom";
import { Bus, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext"; // ✅ Import hook

function Footer() {
  const { t } = useLanguage(); // ✅ Sử dụng hook để dịch

  return (
    // ⭐ Thêm id="contact" để navbar có thể scroll đến đây
    <footer id="contact" className="bg-blue-900 text-white mt-auto">
      <div className="container mx-auto px-6 py-3">
        {/* Nội dung chính */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Thương hiệu */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bus className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">{t('footer.title')}</span> {/* ✅ Dịch */}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.description')} {/* ✅ Dịch */}
            </p>

            {/* Mạng xã hội */}
            <div className="flex gap-3">
              {/* Facebook */}
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Zalo */}
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                  <path fill="#0068FF" d="M4 6a4 4 0 0 1 4-4h32a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H16l-8 8v-8H8a4 4 0 0 1-4-4V6z" />
                  <text x="12" y="25" fill="white" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Zalo</text>
                </svg>
              </a>

              {/* Messenger */}
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2C6.48 2 2 6.07 2 10.99c0 2.85 1.38 5.39 3.6 7.1v3.91l3.33-1.82A9.95 9.95 0 0012 19c5.52 0 10-4.07 10-9.01C22 6.07 17.52 2 12 2zm.75 12.75-2.57-2.73-4.18 2.73 4.7-5.52 2.57 2.73 4.18-2.73-4.7 5.52z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.quickLinks')}</h3> {/* ✅ Dịch */}
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">{t('footer.homePage')}</Link></li> {/* ✅ Dịch */}
              <li><a href="#features" className="text-gray-400 hover:text-white transition">{t('footer.features')}</a></li> {/* ✅ Dịch */}
              <li><a href="#contact" className="text-gray-400 hover:text-white transition">{t('footer.contact')}</a></li> {/* ✅ Dịch */}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.support')}</h3> {/* ✅ Dịch */}
            <ul className="space-y-2 text-gray-400">
              <li><a href="#">{t('footer.faq')}</a></li> {/* ✅ Dịch */}
              <li><a href="#">{t('footer.userGuide')}</a></li> {/* ✅ Dịch */}
              <li><a href="#">{t('footer.privacyPolicy')}</a></li> {/* ✅ Dịch */}
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('footer.contactInfo')}</h3> {/* ✅ Dịch */}
            <ul className="space-y-3 text-gray-400">
              <li className="flex gap-3"><MapPin className="w-5 h-5 text-white" /> {t('footer.location')}</li> {/* ✅ Dịch */}
              <li className="flex gap-3"><Phone className="w-5 h-5 text-white" /><a href="tel:0912345678">{t('footer.phone')}</a></li> {/* ✅ Dịch */}
              <li className="flex gap-3"><Mail className="w-5 h-5 text-white" /><a href="mailto:support@smartschoolbus.vn">{t('footer.email')}</a></li> {/* ✅ Dịch */}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-white text-sm border-t border-gray-700 pt-6">
          {t('footer.copyright')} {/* ✅ Dịch */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;