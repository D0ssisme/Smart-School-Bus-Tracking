import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  bus_id: {
    type: Number,
    required: true,
    unique: true,
  },
  license_plate: {
    type: String,
    required: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'repair'],
    default: 'active',
  },
}, {
  timestamps: true,
});

busSchema.pre('save', async function (next) {
  if (!this.bus_id) {
    const lastBus = await mongoose.model('Bus').findOne().sort('-bus_id');
    this.bus_id = lastBus ? lastBus.bus_id + 1 : 1;
  }
  next();
});

const Bus = mongoose.model('Bus', busSchema);
export default Bus;
