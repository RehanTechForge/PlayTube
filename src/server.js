import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/db.js";
import logger from "../logger.js";
import config from "./config/config.js";

const startServer = async () => {
  try {
    await connectDB();
    const port = config.PORT || 8001;
    app.listen(port, () => {
      logger.info(`Server Connected at PORT ${port}`);
    });
  } catch (error) {
    logger.error(`Error While Connecting Server ${error}`);
    process.exit(1);
  }
};
startServer();
