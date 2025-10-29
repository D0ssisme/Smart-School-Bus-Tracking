import mongoose from "mongoose";


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("connect succesfull")
    } catch (error) {
        console.error("bug when connect database ")
        process.exit(1);

    }
};