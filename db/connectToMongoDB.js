import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectToMongoDB = async () => {
    await mongoose.connect(process.env.MONGO_DB_URL);
    console.log("Connected to mongoDB");
};

export default connectToMongoDB;