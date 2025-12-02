// src/controllers/busLocationController.js
import BusLocation from '../models/BusLocation.js';
import StudentRouteAssignment from '../models/StudentRouteAssignment.js';
import ParentStudent from '../models/ParentStudent.js';
import { io, userSockets } from '../server.js';
import Notification from '../models/Notification.js';

// 🎯 Cache để lưu trạng thái đã gửi thông báo (tránh spam) - CHỈ GỬI 1 LẦN
const sentAlerts = new Map(); // Key: `${studentId}_${stopId}_${type}` → Value: timestamp

// ⭐ Update bus location (called by simulator)
export const updateBusLocation = async (req, res) => {
    try {
        console.log('📥 [BUS LOCATION] Received update request');
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));

        const { bus_id, latitude, longitude, schedule_id, current_stop_index } = req.body;

        // Validate
        if (!bus_id) {
            console.error('❌ Missing bus_id');
            return res.status(400).json({
                success: false,
                message: 'Missing bus_id'
            });
        }

        if (latitude === undefined || longitude === undefined) {
            console.error('❌ Missing coordinates');
            return res.status(400).json({
                success: false,
                message: 'Missing latitude or longitude'
            });
        }

        console.log('💾 Creating BusLocation document...');

        // Save location
        const location = new BusLocation({
            bus_id,
            latitude,
            longitude,
            timestamp: new Date()
        });

        console.log('📝 Document to save:', {
            bus_id: location.bus_id,
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: location.timestamp
        });

        await location.save();
        console.log('✅ Location saved successfully, ID:', location._id);

        // Broadcast via Socket.IO
        io.to(`bus_${bus_id}`).emit('bus_location_update', {
            bus_id,
            latitude,
            longitude,
            timestamp: location.timestamp,
            current_stop_index
        });
        console.log(`📡 Broadcasted to bus_${bus_id}`);

        // ✅ Check proximity alerts - 100m và CHỈ GỬI 1 LẦN
        if (schedule_id) {
            checkProximityAlerts(bus_id, schedule_id, latitude, longitude).catch(err => {
                console.error('❌ Proximity check error:', err);
            });
        }

        res.json({ success: true, location });

    } catch (error) {
        console.error('❌ =============================================');
        console.error('❌ ERROR in updateBusLocation');
        console.error('❌ Message:', error.message);
        console.error('❌ Name:', error.name);
        console.error('❌ Stack:', error.stack);
        console.error('❌ =============================================');

        res.status(500).json({
            success: false,
            message: error.message,
            error: error.name
        });
    }
};

// Get current bus location
export const getCurrentBusLocation = async (req, res) => {
    try {
        const { bus_id } = req.params;

        const location = await BusLocation.findOne({ bus_id })
            .sort({ timestamp: -1 })
            .lean();

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Bus location not found'
            });
        }

        res.json({
            success: true,
            ...location
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get location history
export const getBusLocationHistory = async (req, res) => {
    try {
        const { bus_id } = req.params;
        const { limit = 100 } = req.query;

        const locations = await BusLocation.find({ bus_id })
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .lean();

        res.json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔔 Check proximity và gửi alert khi xe bus cách 100m - CHỈ GỬI 1 LẦN
async function checkProximityAlerts(bus_id, schedule_id, busLat, busLng) {
    try {
        const BusSchedule = (await import('../models/BusSchedule.js')).default;

        // Lấy schedule với route
        const schedule = await BusSchedule.findById(schedule_id)
            .populate('route_id');

        if (!schedule) return;

        // Lấy tất cả học sinh trên tuyến này
        const studentAssignments = await StudentRouteAssignment.find({
            route_id: schedule.route_id._id,
            active: true
        })
            .populate('student_id')
            .populate('pickup_stop_id')
            .populate('dropoff_stop_id');

        for (const assignment of studentAssignments) {
            const studentId = assignment.student_id._id.toString();

            // ✅ CHECK PICKUP STOP (Điểm đón)
            const pickupStop = assignment.pickup_stop_id;
            if (pickupStop?.location) {
                const distanceToPickup = calculateDistance(
                    busLat,
                    busLng,
                    pickupStop.location.coordinates[1],
                    pickupStop.location.coordinates[0]
                );

                // 🎯 Nếu xe cách điểm đón < 100m (0.1km) VÀ chưa gửi thông báo
                const pickupAlertKey = `${studentId}_${pickupStop._id}_pickup`;

                if (distanceToPickup < 0.1 && !sentAlerts.has(pickupAlertKey)) {
                    await sendProximityAlert(
                        assignment.student_id,
                        pickupStop,
                        distanceToPickup,
                        'pickup'
                    );

                    // ✅ Đánh dấu đã gửi (valid trong 15 phút)
                    sentAlerts.set(pickupAlertKey, Date.now());
                    setTimeout(() => sentAlerts.delete(pickupAlertKey), 15 * 60 * 1000);

                    console.log(`✅ Sent PICKUP alert for student ${assignment.student_id.name} at ${(distanceToPickup * 1000).toFixed(0)}m`);
                }
            }

            // ✅ CHECK DROPOFF STOP (Điểm trả)
            const dropoffStop = assignment.dropoff_stop_id;
            if (dropoffStop?.location) {
                const distanceToDropoff = calculateDistance(
                    busLat,
                    busLng,
                    dropoffStop.location.coordinates[1],
                    dropoffStop.location.coordinates[0]
                );

                // 🎯 Nếu xe cách điểm trả < 100m (0.1km) VÀ chưa gửi thông báo
                const dropoffAlertKey = `${studentId}_${dropoffStop._id}_dropoff`;

                if (distanceToDropoff < 0.1 && !sentAlerts.has(dropoffAlertKey)) {
                    await sendProximityAlert(
                        assignment.student_id,
                        dropoffStop,
                        distanceToDropoff,
                        'dropoff'
                    );

                    // ✅ Đánh dấu đã gửi (valid trong 15 phút)
                    sentAlerts.set(dropoffAlertKey, Date.now());
                    setTimeout(() => sentAlerts.delete(dropoffAlertKey), 15 * 60 * 1000);

                    console.log(`✅ Sent DROPOFF alert for student ${assignment.student_id.name} at ${(distanceToDropoff * 1000).toFixed(0)}m`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error checking proximity alerts:', error);
    }
}

// 📨 Gửi thông báo proximity - CẢ ĐIỂM ĐÓN VÀ ĐIỂM TRẢ
async function sendProximityAlert(student, stop, distance, type) {
    try {
        // Lấy tất cả phụ huynh của học sinh này
        const parentLinks = await ParentStudent.find({ student_id: student._id })
            .populate('parent_id');

        const stopType = type === 'pickup' ? 'điểm đón' : 'điểm trả';
        const icon = type === 'pickup' ? '🚏' : '🏫';
        const message = type === 'pickup'
            ? `Xe bus đã đến ${stop.name} (cách ${(distance * 1000).toFixed(0)}m). Vui lòng chuẩn bị đón ${student.name}.`
            : `Xe bus đã đến ${stop.name} (cách ${(distance * 1000).toFixed(0)}m). ${student.name} sắp về đến nhà.`;

        for (const link of parentLinks) {
            const parent = link.parent_id;
            if (!parent) continue;

            // Tạo notification
            const notification = await Notification.create({
                receiver_id: parent._id,
                title: `${icon} Xe bus đã đến ${stopType}!`,
                message: message,
                type: 'info',
                priority: 'high',
                related_type: 'bus_location',
                related_id: student._id,
                isRead: false
            });

            await notification.populate('receiver_id', 'name role');

            // 🔥 Gửi qua Socket.IO
            const socketId = userSockets.get(parent._id.toString());
            if (socketId) {
                io.to(socketId).emit('new_notification', notification);
                console.log(`📨 Sent ${type} alert to parent ${parent.name}`);
            }
        }
    } catch (error) {
        console.error('❌ Error sending proximity alert:', error);
    }
}

// Calculate distance between two points (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}