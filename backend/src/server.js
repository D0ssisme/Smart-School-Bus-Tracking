import express from 'express';
import cors from "cors";
const app = express()
const port = process.env.PORT || 8080
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import busRoutes from './routes/busRoutes.js'
import routerRoutes from './routes/routeRoutes.js';
import RouteStop from './routes/routestop.js';
import Stop from './routes/stopRoutes.js';
import student from './routes/studentRoutes.js'
import ParentStudent from './routes/parentstudentRoutes.js';
import routestop from './routes/routestop.js';
import bus_schedule from './routes/buscheduleRoutes.js';
import studentRouteAssignmentRoutes from "./routes/studentRouteAssignmentRoutes.js";
import studentBusAssignmentRoutes from './routes/studentBusAssignmentRoutes.js';
import Notification from './routes/notificationRoutes.js';

import { connectDB } from './config/db.js';

import dotenv from 'dotenv'

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/login', authRoutes)
app.use('/api/bus', busRoutes)
app.use('/api/route', routerRoutes)
app.use('/api/routestop', RouteStop)
app.use('/api/stop', Stop)
app.use('/api/student',student)
app.use('/api/parentstudent', ParentStudent)
app.use('/api/route-stop', routestop)
app.use('/api/busschedule', bus_schedule)
app.use("/api/studentrouteassignments", studentRouteAssignmentRoutes);
app.use("/api/studentbusassignments", studentBusAssignmentRoutes);  
app.use('/api/notifications', Notification);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`successfully run web by poryt http://localhost:${port}`)
})