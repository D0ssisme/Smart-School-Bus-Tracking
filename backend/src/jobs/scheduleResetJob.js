import cron from 'node-cron';
import BusSchedule from '../models/BusSchedule.js';
import StudentBusAssignment from '../models/StudentBusAssignment.js';

// ✅ Reset all schedules về "scheduled" mỗi ngày lúc 00:00
export function startScheduleResetJob() {
    // Chạy mỗi ngày lúc 00:00 (midnight)
    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('🔄 Starting daily schedule reset...');

            // Reset all completed schedules về "scheduled"
            const result = await BusSchedule.updateMany(
                { status: 'completed' },
                { $set: { status: 'scheduled' } }
            );

            console.log(`✅ Reset ${result.modifiedCount} schedules to "scheduled"`);

            // Reset student pickup/dropoff status
            const studentResult = await StudentBusAssignment.updateMany(
                {
                    $or: [
                        { pickup_status: { $ne: 'pending' } },
                        { dropoff_status: { $ne: 'pending' } }
                    ]
                },
                {
                    $set: {
                        pickup_status: 'pending',
                        dropoff_status: 'pending'
                    }
                }
            );

            console.log(`✅ Reset ${studentResult.modifiedCount} student assignments`);

        } catch (error) {
            console.error('❌ Schedule reset job error:', error);
        }
    });

    console.log('✅ Schedule reset job started (runs daily at midnight)');
}
