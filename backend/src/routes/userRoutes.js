import express from 'express';
const router = express.Router();
import { createUser, deleteUser, getAllUser, updateUser } from '../controllers/userControllers.js';



router.get("/", getAllUser)

router.post("/", createUser)

router.put("/:id", updateUser)

router.delete("/:id", deleteUser)

export default router;