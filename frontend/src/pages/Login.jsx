import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        phoneNumber,
        password,
      });

      console.log("Đăng nhập thành công:", res.data);

      // 🔹 Nếu backend trả token thì lưu lại
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // 🔹 Có thể lưu user info
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // 🔹 Chuyển trang theo role hoặc mặc định
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
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
              <h2 className="text-xl font-bold text-blue-900 text-center">Đăng nhập</h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Chưa có tài khoản?{" "}
                <span className="font-semibold text-gray-400 cursor-not-allowed">Đăng ký</span>
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-blue-900">
                    Số điện thoại
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
                    Mật khẩu
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
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="flex items-center my-4">
                  <span className="w-full border-t border-gray-300"></span>
                  <span className="px-2 text-sm text-gray-500">hoặc</span>
                  <span className="w-full border-t border-gray-300"></span>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center w-full px-4 py-2 space-x-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  <span>Đăng nhập với Google</span>
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
