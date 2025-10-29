import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from '../models/User.js'

dotenv.config();

const seedParent = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const newParent = new User({
      fullName: "Nguyễn Thị Lan",
      email: "parent1@gmail.com",
      password: hashedPassword,
      phoneNumber: "0912345678",
      role: "parent",
      parentInfo: {
        childrenNames: ["Nguyễn Minh Khang"],
        busRoute: null
      }
    });

    await newParent.save();
    console.log("🎉 Created parent account successfully!");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding parent:", error);
    mongoose.connection.close();
  }
};

seedParent();
