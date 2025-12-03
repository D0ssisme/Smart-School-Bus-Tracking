//src/server.js
import express from 'express';
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import routerRoutes from './routes/routeRoutes.js';
import RouteStop from './routes/routestop.js';
import Stop from './routes/stopRoutes.js';
import student from './routes/studentRoutes.js';
import ParentStudent from './routes/parentstudentRoutes.js';
import routestop from './routes/routestop.js';
import bus_schedule from './routes/buscheduleRoutes.js';
import studentRouteAssignmentRoutes from "./routes/studentRouteAssignmentRoutes.js";
import studentBusAssignmentRoutes from './routes/studentBusAssignmentRoutes.js';
import Notification from './routes/notificationRoutes.js';
import IncidentReport from './routes/incidentReportRoutes.js';
import busLocationRoutes from './routes/busLocationRoutes.js'; // ⭐ NEW

import { connectDB } from './config/db.js';
import { startScheduleResetJob } from './jobs/scheduleResetJob.js'; // ⭐ Daily reset job

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

connectDB();
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/login', authRoutes);
app.use('/api/bus', busRoutes);
app.use('/api/route', routerRoutes);
app.use('/api/routestop', RouteStop);
app.use('/api/stop', Stop);
app.use('/api/student', student);
app.use('/api/parentstudent', ParentStudent);
app.use('/api/route-stop', routestop);
app.use('/api/busschedule', bus_schedule);
app.use("/api/studentrouteassignments", studentRouteAssignmentRoutes);
app.use("/api/studentbusassignments", studentBusAssignmentRoutes);
app.use('/api/notifications', Notification);
app.use('/api/incidentreports', IncidentReport);
app.use('/api/bus-locations', busLocationRoutes); // ⭐ NEW

app.get('/', (req, res) => {
  res.send('Smart School Bus API 🚌');
});

// ⚙️ Setup Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"], // Frontend URLs
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Map userId → socketId để gửi notification targeted
export const userSockets = new Map();

// 🔌 Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // 1. User đăng ký userId của họ
  socket.on("register_user", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`👤 User ${userId} registered with socket ${socket.id}`);
    console.log(`📊 Active users: ${userSockets.size}`);
  });

  // 2. Subscribe to bus location updates
  socket.on("subscribe_bus", (busId) => {
    socket.join(`bus_${busId}`);
    console.log(`🚌 Socket ${socket.id} subscribed to bus ${busId}`);
  });

  // 3. Unsubscribe from bus
  socket.on("unsubscribe_bus", (busId) => {
    socket.leave(`bus_${busId}`);
    console.log(`🚫 Socket ${socket.id} unsubscribed from bus ${busId}`);
  });

  // 4. Disconnect
  socket.on("disconnect", () => {
    // Remove user from map
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`❌ User ${userId} disconnected`);
        break;
      }
    }
    console.log(`📊 Active users: ${userSockets.size}`);
  });
});

// Export io để sử dụng trong controllers
export { io };

server.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);

  // ⭐ Start daily schedule reset job
  startScheduleResetJob();
});