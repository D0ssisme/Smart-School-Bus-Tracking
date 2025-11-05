import express from 'express';
const router = express.Router();
import { loginUser } from '../controllers/authControllers.js';

router.post("/", loginUser)

export default router;