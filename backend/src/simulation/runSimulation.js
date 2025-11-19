//src/simulation/runSimulation.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import BusSimulator from './busSimulator.js';

// ✅ QUAN TRỌNG: Import TẤT CẢ models để Mongoose register schemas
import BusSchedule from '../models/BusSchedule.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';
import Route from '../models/Route.js';
import RouteStop from '../models/RouteStop.js';
import Stop from '../models/Stop.js';
import Student from '../models/Student.js';
import StudentBusAssignment from '../models/StudentBusAssignment.js';
import StudentRouteAssignment from '../models/StudentRouteAssignment.js';
import BusLocation from '../models/BusLocation.js';

async function runAllSimulations() {
    try {
        // Connect DB
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log('📦 Connected to MongoDB');

        // Lấy tất cả schedules đang active
        const schedules = await BusSchedule.find({
            status: 'scheduled' // Chỉ lấy schedule đang chờ chạy
        });

        console.log(`🚌 Found ${schedules.length} active schedules`);

        if (schedules.length === 0) {
            console.log('⚠️ No schedules to simulate');
            process.exit(0);
        }

        // Tạo simulator cho mỗi schedule
        const simulators = [];
        for (const schedule of schedules) {
            const simulator = new BusSimulator(schedule._id);
            const initialized = await simulator.initialize();

            if (initialized) {
                await simulator.start();
                simulators.push(simulator);
            } else {
                console.error(`❌ Failed to initialize simulator for ${schedule._id}`);
            }
        }

        console.log(`✅ Started ${simulators.length} simulators`);

        // Graceful shutdown
        process.on('SIGINT', () => {
            console.log('\n🛑 Stopping all simulators...');
            simulators.forEach(sim => sim.stop());
            mongoose.connection.close();
            process.exit(0);
        });

        // Auto stop sau 2 giờ
        setTimeout(() => {
            console.log('⏰ Time limit reached, stopping all simulators');
            simulators.forEach(sim => sim.stop());
            mongoose.connection.close();
            process.exit(0);
        }, 2 * 60 * 60 * 1000);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

runAllSimulations();