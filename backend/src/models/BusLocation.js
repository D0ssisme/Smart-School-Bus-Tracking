import mongoose from 'mongoose';

const busLocationSchema = new mongoose.Schema({
  location_id: {
    type: Number,
    required: true,
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
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
}, {
  timestamps: true,
});


busLocationSchema.pre('save', async function (next) {
  if (!this.location_id) {
    const lastLocation = await mongoose.model('BusLocation').findOne().sort('-location_id');
    this.location_id = lastLocation ? lastLocation.location_id + 1 : 1;
  }
  next();
});

const BusLocation = mongoose.model('BusLocation', busLocationSchema);
export default BusLocation;
