//src/simulation/busSimulator.js
import axios from 'axios';
import Route from '../models/Route.js';
import RouteStop from '../models/RouteStop.js';
import BusSchedule from '../models/BusSchedule.js';

class BusSimulator {
  constructor(scheduleId) {
    this.scheduleId = scheduleId;
    this.schedule = null;
    this.route = null;
    this.stops = [];
    this.path = [];
    this.currentIndex = 0;
    this.currentStopIndex = 0;
    this.isRunning = false;
    this.intervalId = null;
    this.speed = 2000; // Update every 2 seconds
  }

  // Khởi tạo từ schedule
  async initialize() {
    try {
      console.log(`🚌 Initializing simulator for schedule ${this.scheduleId}`);

      // 1. Lấy schedule
      this.schedule = await BusSchedule.findById(this.scheduleId)
        .populate('bus_id')
        .populate('driver_id')
        .populate('route_id');

      if (!this.schedule) {
        throw new Error('Schedule not found');
      }

      console.log(`📋 Schedule: ${this.schedule.bus_id.license_plate} - Driver: ${this.schedule.driver_id.name}`);

      // 2. Lấy route với stops
      const routeStops = await RouteStop.find({ route_id: this.schedule.route_id._id })
        .populate('stop_id')
        .sort({ order_number: 1 });

      this.stops = routeStops.map(rs => ({
        ...rs.stop_id.toObject(),
        order_number: rs.order_number,
        estimated_arrival: rs.estimated_arrival
      }));

      console.log(`📍 Loaded ${this.stops.length} stops`);

      // 3. Tạo path
      if (this.schedule.route_id.path?.coordinates) {
        // Sử dụng path có sẵn
        this.path = this.schedule.route_id.path.coordinates.map(coord => ({
          longitude: coord[0],
          latitude: coord[1]
        }));
      } else {
        // Tạo từ stops
        this.path = this.generatePathFromStops(this.stops);
      }

      console.log(`✅ Generated path with ${this.path.length} points`);
      return true;

    } catch (error) {
      console.error('❌ Initialization error:', error);
      return false;
    }
  }

  // Tạo path mượt giữa các stops
  generatePathFromStops(stops) {
    const path = [];
    
    for (let i = 0; i < stops.length - 1; i++) {
      const start = stops[i].location.coordinates;
      const end = stops[i + 1].location.coordinates;
      const steps = 100; // 100 bước giữa mỗi stop

      for (let j = 0; j <= steps; j++) {
        const t = j / steps;
        path.push({
          longitude: start[0] + (end[0] - start[0]) * t,
          latitude: start[1] + (end[1] - start[1]) * t,
          stopIndex: i
        });
      }
    }

    return path;
  }

  // Bắt đầu simulation
  async start() {
    if (this.isRunning) {
      console.log('⚠️ Simulator already running');
      return;
    }

    if (!this.schedule) {
      const initialized = await this.initialize();
      if (!initialized) {
        console.error('❌ Cannot start without initialization');
        return;
      }
    }

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.update();
    }, this.speed);

    console.log(`🚀 Started simulation for ${this.schedule.bus_id.license_plate}`);
  }

  // Dừng simulation
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log(`🛑 Stopped simulation`);
  }

  // Update vị trí
  async update() {
    if (!this.path || this.path.length === 0) return;

    const position = this.path[this.currentIndex];

    // Kiểm tra xe đến stop
    const reachedStop = this.checkStopArrival(position);
    if (reachedStop) {
      console.log(`🚏 Arrived at: ${reachedStop.name}`);
      this.currentStopIndex = reachedStop.order_number;
      await this.updateStudentStatuses(reachedStop);
    }

    // Cập nhật location
    try {
      await axios.post('http://localhost:8080/api/bus-locations/update', {
        bus_id: this.schedule.bus_id._id,
        latitude: position.latitude,
        longitude: position.longitude,
        schedule_id: this.scheduleId,
        current_stop_index: this.currentStopIndex
      });

      // Next position
      this.currentIndex = (this.currentIndex + 1) % this.path.length;

    } catch (error) {
      console.error('❌ Update error:', error.message);
    }
  }

  // Kiểm tra đến stop
  checkStopArrival(position) {
    for (const stop of this.stops) {
      const distance = this.calculateDistance(
        position.latitude,
        position.longitude,
        stop.location.coordinates[1],
        stop.location.coordinates[0]
      );

      // Nếu trong bán kính 50m coi như đã đến
      if (distance < 0.05 && stop.order_number > this.currentStopIndex) {
        return stop;
      }
    }
    return null;
  }

  // Cập nhật trạng thái học sinh
  async updateStudentStatuses(stop) {
    try {
      const StudentBusAssignment = (await import('../models/StudentBusAssignment.js')).default;
      const StudentRouteAssignment = (await import('../models/StudentRouteAssignment.js')).default;

      // Tìm học sinh có pickup/dropoff ở stop này
      const routeAssignments = await StudentRouteAssignment.find({
        route_id: this.schedule.route_id._id,
        $or: [
          { pickup_stop_id: stop._id },
          { dropoff_stop_id: stop._id }
        ]
      }).populate('student_id');

      for (const ra of routeAssignments) {
        // Cập nhật pickup
        if (ra.pickup_stop_id.toString() === stop._id.toString()) {
          await StudentBusAssignment.findOneAndUpdate(
            {
              student_id: ra.student_id._id,
              schedule_id: this.scheduleId
            },
            { pickup_status: 'picked' },
            { upsert: true }
          );
          console.log(`✅ Picked up: ${ra.student_id.name}`);
        }

        // Cập nhật dropoff
        if (ra.dropoff_stop_id.toString() === stop._id.toString()) {
          await StudentBusAssignment.findOneAndUpdate(
            {
              student_id: ra.student_id._id,
              schedule_id: this.scheduleId
            },
            {
              pickup_status: 'dropped',
              dropoff_status: 'completed'
            }
          );
          console.log(`✅ Dropped off: ${ra.student_id.name}`);
        }
      }

    } catch (error) {
      console.error('❌ Error updating student status:', error);
    }
  }

  // Tính khoảng cách (km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
}
export default BusSimulator;