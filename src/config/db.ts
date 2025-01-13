import mongoose from "mongoose";
import { MONGO_URI } from './environment.js'


const connectDB = async () => {
    // const MONGODB_URI = MONGODB_URI ;
    try {
        await mongoose.connect(MONGO_URI as string);
        console.log("Connect to MongoDB");
    } catch (error) {
        console.log("Unable to connect to MongoDB", error);
        process.exit(0);
    }
};

export default connectDB;
