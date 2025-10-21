import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar_db from "./Navbar_db";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} />
      <div
        className={`flex-1 transition-all duration-1000 ${
          isOpen ? "ml-64" : "ml-18"
        }`}
      >
        {/* Truyền toggleSidebar + isOpen xuống Navbar */}
        <Navbar_db toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />

        <main className="mt-16 p-6 bg-gray-100 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
