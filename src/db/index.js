import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToDB = async () => {
  try {
    console.log("db_uri",process.env.MONGODB_URI,DB_NAME);
    
    const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Connected to the database: ${connectionInstance.connection.name}`);
    console.log(`MongoDB Host: ${connectionInstance.connection.host}`);
    
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1);
  }
}
export default connectToDB;