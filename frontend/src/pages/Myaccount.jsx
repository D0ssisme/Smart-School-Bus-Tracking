import { useAuth } from "../hooks/useAuth"; // hoặc "../context/AuthContext" tuỳ mày đặt
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ToastService from "../lib/toastService";
import { useLanguage } from "../contexts/LanguageContext";

export default function MyAccount() {
  const { user } = useAuth(); // ✅ lấy thông tin user hiện tại
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    Sdt: "",
    hoTen: "",
    address: "",
    gioiTinh: "",
    ngaySinh: "",
  });

  // ✅ Khi user load xong thì gán dữ liệu vào form
  useEffect(() => {
    if (user) {
      setFormData({
        Sdt: user.phoneNumber || "",
        hoTen: user.name || "",
        address: user.email || "",
        gioiTinh: user.gender || "",
        ngaySinh: user.birthDate || "",
      });

      if (user.avatar) setAvatar(user.avatar);
    }
  }, [user]);

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
    const id = ToastService.loading(t('myAccount.updating'));

    try {
      await new Promise((r) => setTimeout(r, 1500));
      ToastService.success(t('myAccount.updateSuccess'));
    } catch {
      ToastService.error(t('myAccount.updateFailed'));
    }
  };

  // ⚠️ Nếu chưa login thì không có user
  if (!user) {
    return (
      <div className="p-10 text-center text-gray-600">
        {t('myAccount.loginRequired')}
      </div>
    );
  }

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
            {t('myAccount.tabs.profile')}
          </button>
          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 font-medium ${activeTab === "password"
              ? "border-b-2 border-blue-900 text-blue-900"
              : "text-gray-600 hover:text-blue-900"
              }`}
          >
            {t('myAccount.tabs.security')}
          </button>
        </div>

        {/* Nội dung tab Hồ sơ */}
        {/* Nội dung tab Hồ sơ */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit} className="p-6 grid grid-cols-3 gap-6">
            {/* Cột trái */}
            <div className="col-span-2 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  {t('myAccount.phone')}
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
                  {t('myAccount.fullName')}
                </label>
                <input
                  type="text"
                  value={formData.hoTen}
                  onChange={(e) =>
                    setFormData({ ...formData, hoTen: e.target.value })
                  }
                  className="h-8 p-1 pl-3  mt-1 w-120 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
                />
              </div>

              {/* ❌ Đã xoá ô nhập địa chỉ */}
              {/* ❌ Đã xoá ô chọn giới tính */}

              <button
                type="submit"
                className="mt-4 px-5 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
              >
                {t('myAccount.updateProfile')}
              </button>
            </div>
          </form>
        )}


        {/* Nội dung tab Mật khẩu */}
        {activeTab === "password" && (
          <form className="p-6 max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('myAccount.currentPassword')}
              </label>
              <input
                type="password"
                className="h-8 p-1 pl-3 mt-1 w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('myAccount.newPassword')}
              </label>
              <input
                type="password"
                className="h-8 p-1 pl-3 mt-1 w-full rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-150 ease-in-out"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('myAccount.confirmPassword')}
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
              {t('myAccount.changePassword')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
