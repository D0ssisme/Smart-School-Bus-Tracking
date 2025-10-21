import React from "react";

function Register() {
  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center px-6">
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl">
        
        {/* Form đăng ký bên trái */}
        <div className="flex-1 flex justify-center mb-10 lg:mb-0">
          <div className="w-full max-w-sm">
            {/* Logo + tên hệ thống */}
            <div className="flex items-center justify-center mb-8 space-x-2">
              <img
                src="/icon/bus.png"
                alt="Logo"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-blue-900">
                Smart School Bus
              </span>
            </div>

            {/* Form box */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-xl font-bold text-blue-900 text-center">
                Đăng ký
              </h2>
              <p className="mt-2 text-sm text-gray-600 text-center">
                Đã có tài khoản?{" "}
                <a
                  href="/login"
                  className="font-semibold text-blue-900 hover:underline"
                >
                  Đăng nhập
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

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-900"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-900 focus:border-blue-900"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-blue-900 border-gray-300 rounded focus:ring-blue-900"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                    Tôi đồng ý với{" "}
                    <a href="#" className="font-semibold text-blue-900 hover:underline">
                      Điều khoản & Chính sách
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-blue-900 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
                >
                  Đăng ký
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ảnh minh họa bên phải */}
        <div className="flex-1.4 flex justify-center">
          <img
            className="object-contain w-[600px] lg:w-[720px] h-auto"
            src="/login.png" // 👉 thay ảnh minh họa đăng ký
            alt="Register Illustration"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
