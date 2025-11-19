// src/models/BusLocation.js
import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
  location_id: {
    type: Number,
    unique: true,
  },
  bus_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    required: true,
    min: -180,
    max: 180
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Auto-increment location_id TRƯỚC KHI validate
busLocationSchema.pre('validate', async function (next) {
  if (!this.location_id) {
    try {
      const BusLocationModel = mongoose.model('BusLocation');
      const lastLocation = await BusLocationModel
        .findOne()
        .sort('-location_id')
        .select('location_id')
        .lean();

      this.location_id = lastLocation ? lastLocation.location_id + 1 : 1;
      console.log('📍 Generated location_id:', this.location_id);
    } catch (error) {
      console.error('❌ Error generating location_id:', error);
      return next(error);
    }
  }
  next();
});

const BusLocation = mongoose.model('BusLocation', busLocationSchema);
export default BusLocation;