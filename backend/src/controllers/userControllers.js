import User from '../models/User.js'
import bcrypt from "bcryptjs";

// test
export const getAllUser = async (req, res) => {

    try {
        const user= await User.find();
         res.status(200).json(user);

    } catch (error) {
        console.error(" loi khi get user !!!");
        res.status(500).json({message : "loi he thong !"});
        
    }
   
}

// test
export const createUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role, driverInfo, parentInfo } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    // Hash 
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      fullName,
      email,
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
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo người dùng:", error);
    res.status(500).json({ message: "Lỗi server khi tạo người dùng!", error: error.message });
  }
};




export const updateUser = (req, res) => {

    res.status(200).send(`🔵 PUT API SUCCESS — cập nhật task có id `);
}


// test 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng để xóa!" });
    }

    res.status(200).json({
      message: "🗑️ Xóa người dùng thành công!",
      user: deletedUser,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa user:", error);
    res.status(500).json({ message: "Lỗi server khi xóa user!", error: error.message });
  }
};

