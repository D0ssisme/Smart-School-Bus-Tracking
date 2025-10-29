import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ JWT secret key (nên lưu trong file .env)
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";

/**
 * 🧩 Đăng ký người dùng mới
 */
export const registerUser = async (req, res) => {
  try {
    const { name, password, phoneNumber, role, driverInfo, parentInfo } = req.body;

    // Check trùng số điện thoại
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: "❌ Số điện thoại đã được sử dụng!" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      name,
      password: hashedPassword,
      phoneNumber,
      role,
      driverInfo,
      parentInfo,
    });

    await newUser.save();

    // Tạo token ngay khi đăng ký xong
    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, {
      expiresIn: "2h", // token hết hạn sau 2 tiếng
    });

    res.status(201).json({
      message: "✅ Đăng ký thành công!",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    res.status(500).json({ message: "Lỗi server khi đăng ký!", error: error.message });
  }
};

/**
 * 🔐 Đăng nhập người dùng
 */
export const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: "❌ Số điện thoại không tồn tại!" });
    }

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "❌ Sai mật khẩu!" });
    }

    // Tạo JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: "✅ Đăng nhập thành công!",
      user: {
        userId: user.userId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server khi đăng nhập!", error: error.message });
  }
};
