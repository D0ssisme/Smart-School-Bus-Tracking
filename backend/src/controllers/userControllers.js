import User from '../models/User.js';
import bcrypt from "bcryptjs";

// 📌 Lấy danh sách tất cả user
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách user:", error);
    res.status(500).json({ message: "Lỗi hệ thống khi lấy danh sách user!" });
  }
};

// 📌 Tạo mới user
export const createUser = async (req, res) => {
  try {
    const { name, password, phone, role, driverInfo, parentInfo } = req.body;

    // Kiểm tra dữ liệu cơ bản
    if (!name || !password || !role) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      phone,
      role,
      driverInfo,
      parentInfo
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ Tạo người dùng thành công!",
      user: {
        user_id: newUser.user_id, // hiển thị mã USER001
        name: newUser.name,
        role: newUser.role,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo người dùng!", error: error.message });
  }
};

// 📌 Cập nhật thông tin user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // id trong MongoDB (ObjectId)
    const { name, password, phone, role, driverInfo, parentInfo } = req.body;

    const updateData = { name, phone, role, driverInfo, parentInfo };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để cập nhật!" });
    }

    res.status(200).json({
      message: "🔵 Cập nhật người dùng thành công!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật user:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật user!", error: error.message });
  }
};

// 📌 Xóa user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để xóa!" });
    }

    res.status(200).json({
      message: "🗑️ Xóa người dùng thành công!",
      user: {
        user_id: deletedUser.user_id,
        name: deletedUser.name,
        role: deletedUser.role,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa user!", error: error.message });
  }
};
