import React from "react";
import { useLanguage } from '../contexts/LanguageContext';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const { t } = useLanguage();
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t rounded-b-lg">
      {/* Nút Trước */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 text-sm rounded-md border transition ${currentPage === 1
            ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
      >
        {t('pagination.previous')}
      </button>

      {/* Số trang */}
      <div className="flex items-center gap-2">
        {pages.map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 text-sm rounded-md border transition-all ${currentPage === num
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Nút Sau */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 text-sm rounded-md border transition ${currentPage === totalPages
            ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
      >
        {t('pagination.next')}
      </button>
    </div>
  );
}

export default Pagination;
