// models/User.js
import mongoose from 'mongoose';
import Counter from './Counter.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true // Bắt buộc phải có
  },
  role: {
    type: String,
    enum: ['admin', 'parent', 'driver'],
    required: true
  },
  driverInfo: {
    licenseNumber: String
   
  },
  parentInfo: {
    address: {
      type: String,
      trim: true // Nên có trim để loại bỏ khoảng trắng thừa
    }
    

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 📦 Tạo userId tự động trước khi lưu
userSchema.pre('save', async function (next) {
  if (this.isNew) {
    const counter = await Counter.findOneAndUpdate(
      { name: 'user' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const nextNumber = counter.seq.toString().padStart(3, '0');
    this.userId = `USER${nextNumber}`;
  }
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
