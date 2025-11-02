// controllers/busScheduleController.js
import BusSchedule from '../models/BusSchedule.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Route from '../models/Route.js';

export const createBusSchedule = async (req, res) => {
  try {
    const { bus_id, driver_id, route_id, start_time, end_time } = req.body;

    // ===== VALIDATION =====

    // 1. Kiểm tra các trường bắt buộc
    if (!bus_id || !driver_id || !route_id || !start_time) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (bus_id, driver_id, route_id, start_time)'
      });
    }

    // 2. Kiểm tra Bus có tồn tại không
    const bus = await Bus.findById(bus_id);
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: `Xe bus với ID '${bus_id}' không tồn tại`
      });
    }

    // 3. Kiểm tra Bus có đang active không
    if (bus.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Xe bus '${bus.license_plate}' không trong trạng thái hoạt động (status: ${bus.status})`
      });
    }

    // 4. Kiểm tra Driver có tồn tại không
    const driver = await User.findById(driver_id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: `Tài xế với ID '${driver_id}' không tồn tại`
      });
    }

    // 5. Kiểm tra User có phải là driver không
    if (driver.role !== 'driver') {
      return res.status(400).json({
        success: false,
        message: `User '${driver.name}' không phải là tài xế (role: ${driver.role})`
      });
    }

    // 6. Kiểm tra Driver có thông tin lái xe không
    if (!driver.driverInfo?.licenseNumber) {
      return res.status(400).json({
        success: false,
        message: `Tài xế '${driver.name}' chưa có thông tin giấy phép lái xe`
      });
    }

    // 7. Kiểm tra Route có tồn tại không
    const route = await Route.findById(route_id)
      .populate('start_point')
      .populate('end_point');
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: `Tuyến đường với ID '${route_id}' không tồn tại`
      });
    }

    // 8. Kiểm tra Route có đang active không
    if (route.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `Tuyến đường '${route.name}' không trong trạng thái hoạt động (status: ${route.status})`
      });
    }

    // 9. Kiểm tra Bus đã có lịch trong thời gian này chưa
    const busConflict = await BusSchedule.findOne({
      bus_id: bus._id,
      status: { $in: ['scheduled', 'in_progress'] }
    });

    if (busConflict) {
      return res.status(409).json({
        success: false,
        message: `Xe bus '${bus.license_plate}' đã có lịch vào ngày }`,
        conflict: {
          schedule_id: busConflict.schedule_id,
          start_time: busConflict.start_time
        }
      });
    }

    // 10. Kiểm tra Driver đã có lịch trong thời gian này chưa
    const driverConflict = await BusSchedule.findOne({
      driver_id: driver._id,
  
      status: { $in: ['scheduled', 'in_progress'] }
    });

    if (driverConflict) {
      return res.status(409).json({
        success: false,
        message: `Tài xế '${driver.name}' đã có lịch `,
        conflict: {
          schedule_id: driverConflict.schedule_id,
         
          start_time: driverConflict.start_time
        }
      });
    }

    // ===== TẠO SCHEDULE =====

    const busSchedule = new BusSchedule({
      bus_id: bus._id,
      driver_id: driver._id,
      route_id: route._id,
      start_time,
      end_time,
      status: 'scheduled'
    });

    await busSchedule.save();

    // ===== POPULATE ĐỂ TRẢ VỀ THÔNG TIN ĐẦY ĐỦ =====

    const populatedSchedule = await BusSchedule.findById(busSchedule._id)
      .populate('bus_id')
      .populate('driver_id')
      .populate({
        path: 'route_id',
        populate: [
          { path: 'start_point' },
          { path: 'end_point' }
        ]
      });

    // ===== TRẢ VỀ RESPONSE =====

    res.status(201).json({
      success: true,
      message: 'Tạo lịch xe bus thành công',
      data: populatedSchedule,
      stats: {
        bus: {
          bus_id: bus.bus_id,
          license_plate: bus.license_plate,
          capacity: bus.capacity
        },
        driver: {
          userId: driver.userId,
          name: driver.name,
          license_number: driver.driverInfo?.licenseNumber
        },
        route: {
          route_id: route.route_id,
          name: route.name,
          start_point: route.start_point?.name,
          end_point: route.end_point?.name
        }
      }
    });

  } catch (error) {
    console.error('Error creating bus schedule:', error);

    // Xử lý lỗi duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Lịch trình đã tồn tại với schedule_id này'
      });
    }

    // Xử lý validation error
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }

    // Xử lý CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: `ID không hợp lệ: ${error.path} = ${error.value}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo lịch xe bus',
      error: error.message
    });
  }
};

// READ ALL
export const getAllBusSchedules = async (req, res) => {
  try {
    const schedules = await BusSchedule.find()
      .populate({ path: "bus_id", select: "license_plate capacity status" })
      .populate({ path: "driver_id", select: "name phone role" })
      .populate({ path: "route_id", select: "name " });

    res.status(200).json(schedules);
  } catch (error) {
    console.error("❌ Lỗi khi lấy BusSchedule:", error);
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

// READ BY ID
export const getBusScheduleById = async (req, res) => {
  try {
    const schedule = await BusSchedule.findById(req.params.id)
      .populate("bus_id")
      .populate("driver_id")
      .populate("route_id");
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateBusSchedule = async (req, res) => {
  try {
    const schedule = await BusSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json(schedule);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE
export const deleteBusSchedule = async (req, res) => {
  try {
    const schedule = await BusSchedule.findByIdAndDelete(req.params.id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
