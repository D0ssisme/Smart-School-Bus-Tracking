import mongoose from 'mongoose';

const studentRouteAssignmentSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // tham chiếu đến học sinh
    required: true
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route', // tham chiếu đến tuyến xe
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Tự động tăng id
studentRouteAssignmentSchema.pre('save', async function (next) {
  if (!this.id) {
    const lastRecord = await mongoose.model('StudentRouteAssignment').findOne().sort('-id');
    this.id = lastRecord ? lastRecord.id + 1 : 1;
  }
  next();
});

// Xuất model
const StudentRouteAssignment = mongoose.model('StudentRouteAssignment', studentRouteAssignmentSchema);
export default StudentRouteAssignment;
