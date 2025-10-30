// src/utils/storage.js
export const saveAuth = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

export const getAuth = () => ({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "{}"),
});
