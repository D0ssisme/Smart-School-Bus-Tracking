import mongoose from 'mongoose';

const busScheduleSchema = new mongoose.Schema({
  schedule_id: {
    type: Number,
    required: true,
    unique: true
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus', // tham chiếu đến xe buýt
    required: true
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // tham chiếu đến tài xế
    required: true
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // tham chiếu đến tuyến đường
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  start_time: {
    type: String, // định dạng HH:mm
    required: true,
    trim: true
  },
  end_time: {
    type: String, // định dạng HH:mm
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tự động tăng schedule_id
busScheduleSchema.pre('save', async function (next) {
  if (!this.schedule_id) {
    const lastSchedule = await mongoose.model('BusSchedule').findOne().sort('-schedule_id');
    this.schedule_id = lastSchedule ? lastSchedule.schedule_id + 1 : 1;
  }
  next();
});

// Xuất model
const BusSchedule = mongoose.model('BusSchedule', busScheduleSchema);
export default BusSchedule;
