import mongoose from 'mongoose';

const parentStudentSchema = new mongoose.Schema(
  {
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // chỉ role: "parent"
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    relationshipType: {
      type: String,
      enum: ['father', 'mother', 'guardian'],
      default: 'guardian',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔹 Đảm bảo 1 phụ huynh không được gán trùng 1 học sinh
parentStudentSchema.index({ parent_id: 1, student_id: 1 }, { unique: true });

// ✅ Tránh lỗi “OverwriteModelError” khi reload
const ParentStudent =
  mongoose.models.ParentStudent ||
  mongoose.model('ParentStudent', parentStudentSchema, 'parent_students');

export default ParentStudent;
