import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  route_id: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  start_point: {
    type: String,
    required: true,
    trim: true
  },
  end_point: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

// 🔸 Tự sinh mã ROUTE001, ROUTE002, ...
routeSchema.pre('save', async function (next) {
  if (!this.route_id) {
    const lastRoute = await mongoose.model('Route').findOne().sort('-route_id');
    let nextNum = 1;
    if (lastRoute && lastRoute.route_id) {
      const lastNum = parseInt(lastRoute.route_id.replace('ROUTE', ''));
      nextNum = lastNum + 1;
    }
    this.route_id = 'ROUTE' + String(nextNum).padStart(3, '0');
  }
  next();
});

const Route = mongoose.model('Route', routeSchema);
export default Route;
