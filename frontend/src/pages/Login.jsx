
//src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // ✅ dùng context thay vì axios
import { useLanguage } from "../contexts/LanguageContext";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { t } = useLanguage();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await login(phoneNumber, password);
    if (res.success) {

      // ✅ BƯỚC 2: THÊM TOAST THÀNH CÔNG TẠI ĐÂY
      Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title: t('login.loginSuccess'),
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      // Có thể điều hướng theo role
      if (res.role === "admin") navigate("/dashboard");
      else if (res.role === "driver") navigate("/contact");
      else navigate("/parent/tracking");

    } else {
      setError(res.message);
      // Bạn cũng có thể dùng toast cho lỗi nếu muốn
      // Swal.fire({
      //   toast: true,
      //   position: "bottom-end",
      //   icon: "error",
      //   title: res.message || "Đăng nhập thất bại!",
      //   timer: 2000,
      //   ...
      // });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl">
        {/* Form bên trái */}
        <div className="flex-1 flex justify-center mb-10 lg:mb-0">
          <div className="w-full max-w-sm">
            <Link to="/" className="flex items-center justify-center mb-8 space-x-2">
              <img src="/icon/bus.png" alt="Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-blue-900">Smart School Bus</span>
            </Link>

            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-blue-900 text-center">{t('login.title')}</h2>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                    {t('login.phoneLabel')}
                  </label>
                  <input
                    id="phone"
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-blue-900">
                    {t('login.passwordLabel')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 disabled:opacity-50"
                >
                  {loading ? t('login.loggingIn') : t('login.loginButton')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ảnh minh họa bên phải */}
        <div className="flex-[1.4] flex justify-center">
          <img
            className="object-contain w-[600px] lg:w-[720px] h-auto"
            src="/login.png"
            alt="Login Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
