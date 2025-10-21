import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl">
        
        {/* Form bên trái */}
        <div className="flex-1 flex justify-center mb-10 lg:mb-0">
          <div className="w-full max-w-sm">
            {/* Logo + tên hệ thống */}
            <Link to="/" className="flex items-center justify-center mb-8 space-x-2">
                <img
                    src="/icon/bus.png"
                    alt="Logo"
                    className="w-10 h-10"
                />
                <span className="text-2xl font-bold text-blue-900">
                    Smart School Bus
                </span>
            </Link>


            {/* Form box */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-blue-900 text-center">
                Đăng nhập
              </h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Chưa có tài khoản?{" "}
                <a
                  href="#"
                  className="font-semibold text-blue-900 hover:underline"
                >
                  Đăng ký
                </a>
              </p>

              <form className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-900"
                  >
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
                  </label>
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-900 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                >
                  Đăng nhập
                </button>

                {/* Divider */}
                <div className="flex items-center my-4">
                  <span className="w-full border-t border-gray-300"></span>
                  <span className="px-2 text-sm text-gray-500">hoặc</span>
                  <span className="w-full border-t border-gray-300"></span>
                </div>

                {/* Login with Google */}
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
