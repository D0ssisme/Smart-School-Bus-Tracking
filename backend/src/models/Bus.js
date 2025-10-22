import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  bus_id: {
    type: String,
    unique: true
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

// ✅ Tự động tạo bus_id kiểu BUS001, BUS002, ...
busSchema.pre('save', async function (next) {
  if (this.bus_id) return next();

  try {
    const lastBus = await mongoose.model('Bus').findOne().sort({ bus_id: -1 });

    let nextNumber = 1;
    if (lastBus && lastBus.bus_id) {
      const match = lastBus.bus_id.match(/\d+$/);
      if (match) nextNumber = parseInt(match[0]) + 1;
    }

    this.bus_id = `BUS${String(nextNumber).padStart(3, '0')}`;
    next();
  } catch (err) {
    next(err);
  }
});

const Bus = mongoose.model('Bus', busSchema);
export default Bus;
