import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function ConnectDB() {
  try {
    const dbUrl: string = process.env.DB_URL as string;
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (error) {
    console.log("Failed to connect to Database");
    console.log(error);
  }
}

export default ConnectDB;
