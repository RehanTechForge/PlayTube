import logger from "../../logger.js";
import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";
import fs from "node:fs";
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_SECRET,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    logger.info(`File Path: ${response.url}`);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    logger.error(`Error While Uploading On Cloudinary ${error}`);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export default uploadOnCloudinary;
