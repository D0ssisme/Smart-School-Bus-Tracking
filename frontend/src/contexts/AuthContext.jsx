// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { getAuth, saveAuth, clearAuth } from "../utils/storage.js";
import { loginApi } from "../api/authApi.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 🧠 Đảm bảo getAuth() không bị null
    const initialAuth = getAuth() || { user: null, token: null };

    const [user, setUser] = useState(initialAuth.user);
    const [token, setToken] = useState(initialAuth.token);
    const [loading, setLoading] = useState(false);

    // 🔄 Nếu có token trong storage, có thể validate lại token ở đây
    useEffect(() => {
        if (token && !user) {
            // Option: gọi API check token (tùy backend)
            // Example:
            // validateTokenApi(token).then(setUser).catch(() => logout());
        }
    }, [token]);

    // 🪪 Xử lý login
    const login = async (phoneNumber, password) => {
        setLoading(true);
        try {
            const data = await loginApi(phoneNumber, password);
            if (!data?.user || !data?.token) throw new Error("Dữ liệu không hợp lệ từ server");

            setUser(data.user);
            setToken(data.token);
            saveAuth(data.token, data.user);

            return { success: true, role: data.user.role };
        } catch (err) {
            console.error("Login error:", err);
            return {
                success: false,
                message: err.response?.data?.message || "Đăng nhập thất bại!",
            };
        } finally {
            setLoading(false);
        }
    };

    // 🚪 Logout
    const logout = () => {
        clearAuth();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
