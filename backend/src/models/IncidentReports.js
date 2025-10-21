import mongoose from 'mongoose';

const incidentReportSchema = new mongoose.Schema({
  report_id: {
    type: Number,
    required: true,
    unique: true
  },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // tham chiếu tới tài xế
    required: true
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus', // tham chiếu tới xe buýt
    required: true
  },
  schedule_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusSchedule', // tham chiếu tới lịch trình
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location_lat: {
    type: Number,
    required: false
  },
  location_lng: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'ignored'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Mô phỏng AUTO_INCREMENT cho report_id
incidentReportSchema.pre('save', async function (next) {
  if (!this.report_id) {
    const lastReport = await mongoose.model('IncidentReport').findOne().sort('-report_id');
    this.report_id = lastReport ? lastReport.report_id + 1 : 1;
  }
  next();
});

// Xuất model
const IncidentReport = mongoose.model('IncidentReport', incidentReportSchema);
export default IncidentReport;
