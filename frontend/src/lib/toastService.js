import toast from "react-hot-toast";

const ToastService = {
  // ✅ Thành công (xanh lá nhạt)
  success: (msg, options = {}) =>
    toast.success(msg, {
      style: {
        background: "#dcfce7",
        color: "#166534",
        border: "1px solid #86efac",
        borderRadius: "8px",
        fontSize: "15px",
        padding: "10px 20px",
      },
      iconTheme: { primary: "#4ade80", secondary: "#fff" },
      ...options,
    }),

  // ❌ Thất bại (đỏ nhạt)
  error: (msg, options = {}) =>
    toast.error(msg, {
      style: {
        background: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #fca5a5",
        borderRadius: "8px",
        fontSize: "15px",
        padding: "10px 20px",
      },
      iconTheme: { primary: "#ef4444", secondary: "#fff" },
      ...options,
    }),

  // ⚠️ Cảnh báo (cam nhạt)
  warning: (msg, options = {}) =>
    toast(msg, {
      icon: "⚠️",
      style: {
        background: "#fff7ed",
        color: "#9a3412",
        border: "1px solid #fdba74",
        borderRadius: "8px",
        fontSize: "15px",
        padding: "10px 20px",
      },
      ...options,
    }),

  // 💡 Thông tin (xanh dương nhạt)
  info: (msg, options = {}) =>
    toast(msg, {
      icon: "💡",
      style: {
        background: "#dbeafe",
        color: "#1e3a8a",
        border: "1px solid #93c5fd",
        borderRadius: "8px",
        fontSize: "15px",
        padding: "10px 20px",
      },
      ...options,
    }),

  // ⏳ Loading (xám nhạt)
  loading: (msg, options = {}) =>
    toast.loading(msg, {
      style: {
        background: "#f3f4f6",
        color: "#111827",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontSize: "15px",
        padding: "10px 20px",
      },
      ...options,
    }),

  // 🔄 Update toast cũ sang success/error/warning/info
  update: (id, msg, type = "success") => {
    toast.dismiss(id);
    ToastService[type](msg);
  },
};

export default ToastService;
