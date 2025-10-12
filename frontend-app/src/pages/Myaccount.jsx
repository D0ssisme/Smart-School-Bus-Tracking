import { useState } from "react";
import toast from "react-hot-toast";
import ToastService from "../lib/toastService";

export default function MyAccount() {
    const [activeTab, setActiveTab] = useState("profile");
    const [avatar, setAvatar] = useState("https://cdn-icons-png.flaticon.com/512/219/219983.png");
    const [formData, setFormData] = useState({
        Sdt: "0123456789",
        hoTen: "Nguyễn Kim Long",
        email: "longnguyen210405@gmail.com",
        gioiTinh: "Nam",
        ngaySinh: "2005-05-21",
    });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => setAvatar(event.target.result);
            reader.readAsDataURL(file);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const id = ToastService.loading("Đang cập nhật...");

        try {
            await new Promise((r) => setTimeout(r, 1500));
            ToastService.success(" Hồ sơ đã được cập nhật!");
        } catch {
            ToastService.error(" Cập nhật thất bại!");
        }
    };


    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
                {/* Tabs */}
                <div className="border-b flex">
                    <button
                        onClick={() => setActiveTab("profile")}
                        className={`px-6 py-3 font-medium ${activeTab === "profile"
                                ? "border-b-2 border-blue-900 text-blue-900"
                                : "text-gray-600 hover:text-blue-900"
                            }`}
                    >
                        Hồ sơ
                    </button>
                    <button
                        onClick={() => setActiveTab("password")}
                        className={`px-6 py-3 font-medium ${activeTab === "password"
                                ? "border-b-2 border-blue-900 text-blue-900"
                                : "text-gray-600 hover:text-blue-900"
                            }`}
                    >
                        Mật khẩu
                    </button>
                </div>

                {/* Nội dung tab Hồ sơ */}
                {activeTab === "profile" && (
                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-3 gap-6">
                        {/* Cột trái */}
                        <div className="col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Số điện thoại
                                </label>
                                <input
                                    type="text"
                                    value={formData.Sdt}
                                    disabled
                                    className="h-8 p-1 pl-3 mt-1 w-120 rounded-md border border-gray-300 bg-gray-100 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    value={formData.hoTen}
                                    onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
                                    className="h-8 p-1 pl-3  mt-1 w-120 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Địa chỉ email
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-8 p-1 pl-3 mt-1 w-120 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Giới tính
                                </label>
                                <div className="mt-2 flex gap-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nam"
                                            checked={formData.gioiTinh === "Nam"}
                                            onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                                            className="text-blue-900 focus:ring-blue-400"
                                        />
                                        Nam
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nữ"
                                            checked={formData.gioiTinh === "Nữ"}
                                            onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value })}
                                            className="text-blue-900 focus:ring-blue-900"
                                        />
                                        Nữ
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    value={formData.ngaySinh}
                                    onChange={(e) => setFormData({ ...formData, ngaySinh: e.target.value })}
                                    className="h-8 p-1 pl-3 mt-1 w-120 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
                            >
                                Cập nhật hồ sơ
                            </button>
                        </div>

                        {/* Cột phải */}
                        <div className="flex flex-col items-center">
                            <img
                                src={avatar}
                                alt="avatar"
                                className="w-24 h-24 rounded-full border border-gray-300 object-cover"
                            />
                            <label className="mt-3 text-sm text-gray-700 font-medium">
                                Chọn ảnh đại diện mới
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="mt-2 text-sm h-8 p-1 pl-3 w-70 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            />
                        </div>
                    </form>
                )}

                {/* Nội dung tab Mật khẩu */}
                {activeTab === "password" && (
                    <form className="p-6 max-w-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu hiện tại
                            </label>
                            <input
                                type="password"
                                className="h-8 p-1 pl-3 mt-1 w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                className="h-8 p-1 pl-3 mt-1 w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                className="h-8 p-1 pl-3 mt-1 w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
                        >
                            Cập nhật mật khẩu
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}