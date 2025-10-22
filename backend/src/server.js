import express from 'express';
import cors from "cors";
const app = express()
const port = process.env.PORT || 8080
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import busRoutes from './routes/busRoutes.js'
import routerRoutes from './routes/routeRoutes.js';
import routestop from './routes/routestop.js'
import { connectDB } from './config/db.js';
import dotenv from 'dotenv'

dotenv.config();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/login', authRoutes)
app.use('/api/bus',busRoutes)
app.use('/api/route',routerRoutes)
app.use('/api/routestop',routestop)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.listen(port, () => {
  console.log(`successfully run web by poryt http://localhost:${port}`)
})