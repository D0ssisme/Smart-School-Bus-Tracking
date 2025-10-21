import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  notification_id: {
    type: Number,
    required: true,
    unique: true
  },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // người gửi
    required: true
  },
  receiver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // người nhận
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['alert', 'info', 'reminder'],
    default: 'info'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Tự động tăng notification_id
notificationSchema.pre('save', async function (next) {
  if (!this.notification_id) {
    const last = await mongoose.model('Notification').findOne().sort('-notification_id');
    this.notification_id = last ? last.notification_id + 1 : 1;
  }
  next();
});

// Xuất model
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
