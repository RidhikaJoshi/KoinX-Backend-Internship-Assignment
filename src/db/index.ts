import mongoose from "mongoose";
import { DB_NAME } from "../contants";

const connectDB = async () => {
  try {
    // connect to mongodb
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    ); // mongoose gives you returned object
    console.log(
      `MongoDb connected, DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    //  if error occurs while connecting to database
    console.log("Error occurred while connecting to database", error);
    process.exit(1);
  }
};
export default connectDB;
