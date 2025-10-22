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

 
  driverInfo: {
    licenseNumber: String, 
    vehiclePlate: String,  
    busRoute: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BusRoute' 
    }
  },

  parentInfo: {
    childrenNames: [String], 
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


const User = mongoose.model('User', userSchema);
export default User;

