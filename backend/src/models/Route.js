import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  route_id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  start_point: {
    type: String,
    required: true,
    trim: true,
  },
  end_point: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Mô phỏng auto-increment cho route_id
routeSchema.pre('save', async function (next) {
  if (!this.route_id) {
    const lastRoute = await mongoose.model('Route').findOne().sort('-route_id');
    this.route_id = lastRoute ? lastRoute.route_id + 1 : 1;
  }
  next();
});

const Route = mongoose.model('Route', routeSchema);
export default Route;
