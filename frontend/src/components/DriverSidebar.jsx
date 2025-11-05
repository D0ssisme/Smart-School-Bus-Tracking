import { LayoutDashboard, CalendarDays, Users, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function DriverSidebar({ isOpen }) {
    const item = "flex items-center px-5 py-2 rounded hover:bg-gray-100 relative";
    const icon = "w-5 h-5 text-blue-900";

    return (
        <aside
            className={`${isOpen ? "w-64" : "w-18"
                } bg-white h-screen shadow-md fixed left-0 top-0 transition-all duration-1000 overflow-hidden`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center border-b bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 pl-5 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}></div>
                </div>

                {/* Logo content */}
                <div className="relative flex items-center gap-3">
                    {/* Bus icon with animation */}
                    <div className="relative">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 border border-white/30">
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-white"
                            >
                                {/* Bus body */}
                                <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
                                {/* Windows */}
                                <rect x="6" y="8" width="5" height="4" rx="1" fill="white" />
                                <rect x="13" y="8" width="5" height="4" rx="1" fill="white" />
                                {/* Wheels */}
                                <circle cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white" />
                                <circle cx="16" cy="18" r="2" stroke="currentColor" strokeWidth="2" fill="white" />
                                {/* Top light */}
                                <rect x="10" y="4" width="4" height="2" rx="1" fill="currentColor" />
                            </svg>
                        </div>
                        {/* Pulse effect */}
                        <div className="absolute inset-0 bg-blue-400 rounded-lg animate-ping opacity-20"></div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col">
                        <span className="text-xl font-bold text-white leading-tight tracking-wide">
                            {isOpen ? "SSB Tracking" : "SSB"}
                        </span>
                        {isOpen && (
                            <span className="text-[10px] text-blue-200 font-medium tracking-wider uppercase">
                                School Bus System
                            </span>
                        )}
                    </div>
                </div>

                {/* Right decoration */}
                {isOpen && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
                        <div className="flex gap-1">
                            <div className="w-1 h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                            <div className="w-1 h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Menu tài xế */}
            <nav className="mt-3 space-y-1">

                <Link to="/contact" className={item}>
                    <LayoutDashboard className={icon} />
                    <span
                        className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Trang chủ
                    </span>
                </Link>

                <Link to="/driver" className={item}>

                    <CalendarDays className={icon} />
                    <span
                        className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Lịch làm việc
                    </span>
                </Link>

                <Link to="/driver/students" className={item}>
                    <Users className={icon} />
                    <span
                        className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Danh sách học sinh
                    </span>
                </Link>

                <Link to="/driver/report" className={item}>
                    <CheckCircle className={icon} />
                    <span
                        className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Báo cáo đón/trả
                    </span>
                </Link>

                <Link to="/driver/alert" className={item}>
                    <AlertTriangle className={icon} />
                    <span
                        className={`absolute left-14 whitespace-nowrap transition-all duration-500 text-black font-medium ${isOpen ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        Gửi Báo Cáo Về Sự Cố!!
                    </span>
                </Link>
            </nav>
        </aside>
    );
}