import mongoose from 'mongoose';
import Counter from './Counter.js';

const studentSchema = new mongoose.Schema({
  student_id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// 🔹 Auto-generate student_id: STU001, STU002, ...
studentSchema.pre('save', async function (next) {
  if (this.isNew && !this.student_id) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'student' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // tạo nếu chưa tồn tại
    );

    const nextNumber = counter.seq.toString().padStart(3, '0');
    this.student_id = `STU${nextNumber}`;
  }
  next();
});

// ✅ tránh lỗi “model declared twice” khi reload
const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
