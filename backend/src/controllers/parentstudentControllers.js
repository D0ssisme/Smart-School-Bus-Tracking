import ParentStudent from "../models/ParentStudent.js";
import User from "../models/User.js";
import Student from "../models/Student.js";

// 🟢 Lấy toàn bộ quan hệ phụ huynh - học sinh
export const getAllParentStudent = async (req, res) => {
    try {
        const data = await ParentStudent.find()
            .populate("parent_id", "userId name role")
            .populate("student_id", "student_id name grade");
        res.status(200).json(data);
    } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách quan hệ:", error);
        res.status(500).json({ message: "Lỗi server khi lấy danh sách quan hệ!", error: error.message });
    }
};

// 🟢 Tạo mới quan hệ phụ huynh - học sinh
export const createParentStudent = async (req, res) => {
    try {
        const { parent_id, student_id } = req.body;

        // kiểm tra tồn tại
        const parent = await User.findById(parent_id);
        const student = await Student.findById(student_id);

        if (!parent || parent.role !== "parent") {
            return res.status(400).json({ message: "❌ ID này không thuộc về phụ huynh hợp lệ!" });
        }

        if (!student) {
            return res.status(400).json({ message: "❌ Học sinh không tồn tại!" });
        }

        const newRelation = new ParentStudent({
            parent_id,
            student_id,
       
        });

        await newRelation.save();

        res.status(201).json({
            message: "✅ Tạo quan hệ phụ huynh - học sinh thành công!",
            data: newRelation,
        });
    } catch (error) {
        console.error("❌ Lỗi khi tạo quan hệ:", error);
        res.status(500).json({ message: "Lỗi server khi tạo quan hệ!", error: error.message });
    }
};

// 🟢 Lấy danh sách học sinh theo ID phụ huynh
export const getStudentsByParent = async (req, res) => {
    try {
        const { parent_id } = req.params;

        const relations = await ParentStudent.find({ parent_id })
            .populate("student_id", "student_id name grade");

        if (relations.length === 0) {
            return res.status(404).json({ message: "❌ Không tìm thấy học sinh nào cho phụ huynh này!" });
        }

        res.status(200).json(relations);
    } catch (error) {
        console.error("❌ Lỗi khi lấy học sinh của phụ huynh:", error);
        res.status(500).json({ message: "Lỗi server khi lấy học sinh!", error: error.message });
    }
};

// 🟡 Cập nhật quan hệ
export const updateParentStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const {  active } = req.body;

        const updated = await ParentStudent.findByIdAndUpdate(
            id,
            {  active },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Không tìm thấy quan hệ để cập nhật!" });
        }

        res.status(200).json({
            message: "✅ Cập nhật quan hệ thành công!",
            data: updated,
        });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật quan hệ:", error);
        res.status(500).json({ message: "Lỗi server khi cập nhật!", error: error.message });
    }
};

// 🔴 Xóa quan hệ
export const deleteParentStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ParentStudent.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Không tìm thấy quan hệ để xóa!" });
        }

        res.status(200).json({
            message: "🗑️ Xóa quan hệ thành công!",
            data: deleted,
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa quan hệ:", error);
        res.status(500).json({ message: "Lỗi server khi xóa!", error: error.message });
    }
};
