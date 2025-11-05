import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // tên loại counter (vd: 'student', 'user', 'bus')
  seq: { type: Number, default: 0 } // giá trị hiện tại
});

// ✅ tránh lỗi khi nodemon reload
const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

export default Counter;
