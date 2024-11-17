import mongoose from "mongoose";
import logger from "../../logger.js";
import config from "../config/config.js";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("error", (error) => {
      logger.error(`Error While Connecting To MongoDb || ${error}`);
    });
    mongoose.connection.on("connected", () => {
      logger.info(
        `MongoDb Connected Successfully || DB Host ! ${mongoose.connection.host}`
      );
    });
    mongoose.connection.on("disconnected", () => {
      logger.warn(`MongoDb Disconnected Successfully`);
    });

    await mongoose.connect(`${config.MONGODB_URI}/${DB_NAME}`);
  } catch (error) {
    logger.error(`Error While Connecting To MongoDb || ${error}`);
    process.exit(1);
  }
};
export default connectDB;
