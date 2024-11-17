import mongoose from "mongoose";
import logger from "../../logger.js";
import config from "../config/config.js";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("error", (error) => {
      logger.error(`MongoDB Connection Error: ${error.message || error}`);
    });

    mongoose.connection.on("connected", () => {
      logger.info(
        `MongoDB Connected Successfully! Host: ${mongoose.connection.host}, Database: ${DB_NAME}`
      );
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB Connection Lost: Connection was closed.");
    });

    await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    logger.error(
      `Failed to connect to MongoDB. Error: ${error.message || error}`
    );

    process.exit(1);
  }
};

export default connectDB;
