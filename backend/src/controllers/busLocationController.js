

// ⭐ Update bus location (called by simulator)
// src/controllers/busLocationController.js
import BusLocation from '../models/BusLocation.js';
import StudentRouteAssignment from '../models/StudentRouteAssignment.js';
import ParentStudent from '../models/ParentStudent.js';
import { io, userSockets } from '../server.js';
import Notification from '../models/Notification.js';

// Cache để tránh gửi thông báo trùng lặp
const sentAlerts = new Map();

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

        // Check proximity alerts (async, không block response)
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

// 🔔 Check proximity and send alerts
async function checkProximityAlerts(bus_id, schedule_id, busLat, busLng) {
    try {
        const BusSchedule = (await import('../models/BusSchedule.js')).default;
        const Stop = (await import('../models/Stop.js')).default;

        // Get schedule with route
        const schedule = await BusSchedule.findById(schedule_id)
            .populate('route_id');

        if (!schedule) return;

        // Get all students on this route
        const studentAssignments = await StudentRouteAssignment.find({
            route_id: schedule.route_id._id,
            active: true
        })
            .populate('student_id')
            .populate('pickup_stop_id')
            .populate('dropoff_stop_id');

        for (const assignment of studentAssignments) {
            const pickupStop = assignment.pickup_stop_id;
            if (!pickupStop?.location) continue;

            // Calculate distance to pickup stop
            const distance = calculateDistance(
                busLat,
                busLng,
                pickupStop.location.coordinates[1],
                pickupStop.location.coordinates[0]
            );

            // 🔔 Alert when bus is within 1km
            if (distance < 1 && distance > 0.5) {
                await sendProximityAlert(assignment.student_id, pickupStop, distance, '1km');
            }

            // 🔔 Alert when bus arrives at stop
            if (distance < 0.05) { // Within 50m
                await sendArrivalAlert(assignment.student_id, pickupStop);
            }
        }
    } catch (error) {
        console.error('Error checking proximity alerts:', error);
    }
}

// 📨 Send proximity alert
async function sendProximityAlert(student, stop, distance, threshold) {
    try {
        // Get all parents of this student
        const parentLinks = await ParentStudent.find({ student_id: student._id })
            .populate('parent_id');

        for (const link of parentLinks) {
            const parent = link.parent_id;
            if (!parent) continue;

            // Create notification
            const notification = await Notification.create({
                receiver_id: parent._id,
                title: `🚌 Xe bus sắp đến!`,
                message: `Xe bus đang cách điểm đón ${stop.name} khoảng ${distance.toFixed(2)} km. Dự kiến đến trong ${Math.ceil(distance / 0.4)} phút nữa.`,
                type: 'info',
                priority: 'high',
                related_type: 'bus_location',
                related_id: student._id,
                isRead: false
            });

            await notification.populate('receiver_id', 'name role');

            // 🔥 Send via Socket.IO
            const socketId = userSockets.get(parent._id.toString());
            if (socketId) {
                io.to(socketId).emit('new_notification', notification);
                console.log(`📨 Sent proximity alert to parent ${parent.name}`);
            }
        }
    } catch (error) {
        console.error('Error sending proximity alert:', error);
    }
}

// 📨 Send arrival alert
async function sendArrivalAlert(student, stop) {
    try {
        const parentLinks = await ParentStudent.find({ student_id: student._id })
            .populate('parent_id');

        for (const link of parentLinks) {
            const parent = link.parent_id;
            if (!parent) continue;

            const notification = await Notification.create({
                receiver_id: parent._id,
                title: `📍 Xe bus đã đến!`,
                message: `Xe bus đã đến ${stop.name}. Vui lòng chuẩn bị đón ${student.name}.`,
                type: 'success',
                priority: 'urgent',
                related_type: 'bus_arrival',
                related_id: student._id,
                isRead: false
            });

            await notification.populate('receiver_id', 'name role');

            const socketId = userSockets.get(parent._id.toString());
            if (socketId) {
                io.to(socketId).emit('new_notification', notification);
                console.log(`📨 Sent arrival alert to parent ${parent.name}`);
            }
        }
    } catch (error) {
        console.error('Error sending arrival alert:', error);
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