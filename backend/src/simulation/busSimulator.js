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
    this.speed = 5000; // 🔧 5 giây mỗi bước (RẤT chậm để test dễ)
    this.isCompleted = false; // ✅ Thêm flag để check xe đã hoàn thành chưa
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

      // 3. ✅ LUÔN generate path mới từ stops để đảm bảo mượt mà
      this.path = this.generatePathFromStops(this.stops);

      console.log(`✅ Generated path with ${this.path.length} points`);
      return true;

    } catch (error) {
      console.error('❌ Initialization error:', error);
      return false;
    }
  }

  // ✅ Tạo path mượt giữa các stops - FIXED VERSION
  generatePathFromStops(stops) {
    const path = [];
    const METERS_PER_STEP = 50; // 🔧 Mỗi bước di chuyển 50m (điều chỉnh theo ý muốn)

    for (let i = 0; i < stops.length - 1; i++) {
      const start = stops[i].location.coordinates;
      const end = stops[i + 1].location.coordinates;

      // ✅ Tính khoảng cách thực tế giữa 2 stops
      const distance = this.calculateDistance(
        start[1], start[0],  // latitude, longitude
        end[1], end[0]
      ) * 1000; // Chuyển km → m

      // ✅ Tính số bước dựa trên khoảng cách
      const steps = Math.max(5, Math.ceil(distance / METERS_PER_STEP));

      console.log(`📏 Distance ${stops[i].name} → ${stops[i + 1].name}: ${distance.toFixed(0)}m → ${steps} steps`);

      // Tạo các điểm trung gian
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

    // ✅ Reset tất cả trạng thái đón/trả của học sinh về pending
    try {
      const StudentBusAssignment = (await import('../models/StudentBusAssignment.js')).default;
      const resetResult = await StudentBusAssignment.updateMany(
        { schedule_id: this.scheduleId },
        {
          $set: {
            pickup_status: 'pending',
            dropoff_status: 'pending'
          }
        }
      );
      console.log(`🔄 Reset ${resetResult.modifiedCount} student statuses to pending`);
    } catch (error) {
      console.error('❌ Error resetting student statuses:', error);
    }

    this.isRunning = true;
    this.isCompleted = false; // ✅ Reset completed flag
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

    // ✅ CHECK: Nếu đã đến điểm cuối thì DỪNG LẠI
    if (this.currentIndex >= this.path.length - 1) {
      if (!this.isCompleted) {
        this.isCompleted = true;
        console.log(`🏁 Bus has reached the final destination!`);
        console.log(`📍 Final stop: ${this.stops[this.stops.length - 1].name}`);

        // Update trạng thái cuối cùng
        await this.updateFinalLocation();
      }
      this.stop(); // Dừng hẳn simulator
      return;
    }

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

      // ✅ Next position - KHÔNG loop lại nữa
      this.currentIndex++;

    } catch (error) {
      console.error('❌ Update error:', error.message);
    }
  }

  // ✅ Cập nhật vị trí cuối cùng khi xe đã hoàn thành
  async updateFinalLocation() {
    try {
      const finalPosition = this.path[this.path.length - 1];
      await axios.post('http://localhost:8080/api/bus-locations/update', {
        bus_id: this.schedule.bus_id._id,
        latitude: finalPosition.latitude,
        longitude: finalPosition.longitude,
        schedule_id: this.scheduleId,
        current_stop_index: this.stops.length - 1,
        is_completed: true // Thêm flag để backend biết xe đã xong
      });

      // ✅ Cập nhật schedule status = "completed"
      await BusSchedule.findByIdAndUpdate(this.scheduleId, {
        status: 'completed'
      });
      console.log(`✅ Schedule ${this.scheduleId} marked as completed`);

    } catch (error) {
      console.error('❌ Final update error:', error.message);
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
      const ParentStudent = (await import('../models/ParentStudent.js')).default;

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

          // 📨 Gửi thông báo cho phụ huynh qua API
          await this.sendParentNotificationViaAPI(
            ra.student_id._id,
            ra.student_id.name,
            'picked',
            stop.name,
            ParentStudent
          );
        }

        // Cập nhật dropoff
        if (ra.dropoff_stop_id.toString() === stop._id.toString()) {
          await StudentBusAssignment.findOneAndUpdate(
            {
              student_id: ra.student_id._id,
              schedule_id: this.scheduleId
            },
            {
              dropoff_status: 'dropped'
            }
          );
          console.log(`✅ Dropped off: ${ra.student_id.name}`);

          // 📨 Gửi thông báo cho phụ huynh qua API
          await this.sendParentNotificationViaAPI(
            ra.student_id._id,
            ra.student_id.name,
            'dropped',
            stop.name,
            ParentStudent
          );
        }
      }

    } catch (error) {
      console.error('❌ Error updating student status:', error);
    }
  }

  // 📨 Gửi thông báo cho phụ huynh qua API
  async sendParentNotificationViaAPI(studentId, studentName, action, stopName, ParentStudent) {
    try {
      // Tìm phụ huynh của học sinh
      const parentRelations = await ParentStudent.find({ student_id: studentId }).populate('parent_id');

      for (const relation of parentRelations) {
        const parentId = relation.parent_id._id;

        // Tạo nội dung thông báo
        const message = action === 'picked'
          ? `Học sinh ${studentName} đã được đón tại điểm dừng ${stopName}`
          : `Học sinh ${studentName} đã được trả tại điểm dừng ${stopName}`;

        const title = action === 'picked' ? 'Đã đón học sinh' : 'Đã trả học sinh';

        // Gửi notification qua API (server sẽ tự động broadcast qua Socket.IO)
        try {
          await axios.post('http://localhost:8080/api/notifications', {
            receiver_id: parentId,
            title: title,
            message: message,
            type: 'status_update',
            is_read: false
          });
          console.log(`📨 Notification sent to parent ${parentId} for ${studentName}`);
        } catch (apiError) {
          console.error(`⚠️ Failed to send notification for ${studentName}:`, apiError.message);
        }
      }
    } catch (error) {
      console.error('❌ Error sending parent notification:', error);
    }
  }

  // Tính khoảng cách (km)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
}

export default BusSimulator;