import { useState } from "react";
import ParentSidebar from "./ParentSidebar";
import Navbar_db from "./Navbar_db";

export default function ParentLayout({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex">
            <ParentSidebar isOpen={isOpen} />
            <div
                className={`flex-1 transition-all duration-1000 ${
                    isOpen ? "ml-64" : "ml-18"
                }`}
            >
                <main className="mt-16 p-6 bg-gray-100 min-h-screen">{children}</main>
                <Navbar_db toggleSidebar={() => setIsOpen(!isOpen)} isOpen={isOpen} />
            </div>
        </div>
    );
}