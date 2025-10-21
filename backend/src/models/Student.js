import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  student_id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  grade: {
    type: String,
    required: true,
    trim: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Tham chiếu đến model User
    required: true,
  },
  pickup_point: {
    type: String,
    required: true,
    trim: true,
  },
  dropoff_point: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Mô phỏng auto-increment cho student_id
studentSchema.pre('save', async function (next) {
  if (!this.student_id) {
    const lastStudent = await mongoose.model('Student').findOne().sort('-student_id');
    this.student_id = lastStudent ? lastStudent.student_id + 1 : 1;
  }
  next();
});

const Student = mongoose.model('Student', studentSchema);
export default Student;
