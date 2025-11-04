import User from '../models/User.js';
import bcrypt from "bcryptjs";
import ParentStudent from "../models/ParentStudent.js";

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



export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver" });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getParents = async (req, res) => {
  try {
    const parents = await User.find({ role: "parent" });
    res.json(parents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};








export const createUser = async (req, res) => {
  try {

    const { name, password, phoneNumber, role, driverInfo, parentInfo } = req.body;


    if (!name || !password || !role || !phoneNumber) {

      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    // Mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      phoneNumber,
      role,
      driverInfo,
      parentInfo
    });

    await newUser.save();

    res.status(201).json({
      message: "✅ Tạo người dùng thành công!",
      user: {
        userId: newUser.userId,
        name: newUser.name,
        role: newUser.role,
        phoneNumber: newUser.phoneNumber,
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

    // Tìm user trước
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy user!" });
    }

    // Kiểm tra role nếu là parent
    if (user.role === "parent") {
      // Tìm trong ParentStudent xem có học sinh nào liên kết không
      const relation = await ParentStudent.findOne({ parent_id: id }); // ✅ Sửa field name

      if (relation) {
        return res.status(400).json({
          message: "Không thể xóa vì phụ huynh còn đang có con liên kết!",
        });
      }
    }

    // Nếu không có vấn đề -> Xóa
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "🗑️ Xóa user thành công!" });

  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa!", error: error.message });
  }
};