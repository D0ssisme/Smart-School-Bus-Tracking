import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import StudentBusAssignment from "../models/StudentBusAssignment.js";

async function resetStatuses() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

        console.log("🔄 Resetting student assignment statuses...");

        await StudentBusAssignment.updateMany({}, {
            pickup_status: "pending",
            dropoff_status: "pending"
        });

        console.log("✅ Reset done!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Reset failed:", err);
        process.exit(1);
    }
}

resetStatuses();
