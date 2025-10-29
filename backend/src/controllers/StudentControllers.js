import Student from "../models/Student.js";

// 🟢 Lấy toàn bộ danh sách học sinh
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách học sinh:", error);
    res.status(500).json({ message: "Lỗi server khi lấy danh sách học sinh!" });
  }
};

// 🟢 Lấy học sinh theo ID (MongoDB _id hoặc student_id)
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student =
      (await Student.findById(id)) || (await Student.findOne({ student_id: id }));

    if (!student) {
      return res.status(404).json({ message: "Không tìm thấy học sinh!" });
    }

    res.status(200).json(student);
  } catch (error) {
    console.error("❌ Lỗi khi lấy học sinh:", error);
    res.status(500).json({ message: "Lỗi server khi lấy học sinh!" });
  }
};

// 🟢 Tạo mới học sinh
export const createStudent = async (req, res) => {
  try {
    const { name, grade } = req.body;

    if (!name || !grade) {
      return res.status(400).json({ message: "Thiếu thông tin name hoặc grade!" });
    }

    const newStudent = new Student({ name, grade });
    await newStudent.save();

    res.status(201).json({
      message: "✅ Tạo học sinh thành công!",
      student: newStudent,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo học sinh:", error);
    res.status(500).json({ message: "Lỗi server khi tạo học sinh!" });
  }
};

// 🟢 Cập nhật học sinh
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, grade } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, grade },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Không tìm thấy học sinh để cập nhật!" });
    }

    res.status(200).json({
      message: "✏️ Cập nhật học sinh thành công!",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật học sinh:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật học sinh!" });
  }
};

// 🟢 Xóa học sinh
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedStudent =
      (await Student.findByIdAndDelete(id)) ||
      (await Student.findOneAndDelete({ student_id: id }));

    if (!deletedStudent) {
      return res.status(404).json({ message: "Không tìm thấy học sinh để xóa!" });
    }

    res.status(200).json({
      message: "🗑️ Xóa học sinh thành công!",
      student: deletedStudent,
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa học sinh:", error);
    res.status(500).json({ message: "Lỗi server khi xóa học sinh!" });
  }
};
