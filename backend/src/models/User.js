import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['admin', 'parent', 'driver'],
    required: true
  },

  // Nếu là tài xế:
  driverInfo: {
    licenseNumber: String, // số bằng lái
    vehiclePlate: String,  // biển số xe
    busRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute' // liên kết tới tuyến xe
    }
  },

  // Nếu là phụ huynh:
  parentInfo: {
    childrenNames: [String], // tên các con
    busRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute'
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Xuất model
const User = mongoose.model('User', userSchema);
export default User;

