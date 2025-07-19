import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from "fs"

dotenv.config(); 

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
        // console.log(result)

   fs.unlinkSync(localFilePath)
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
    console.error("Cloudinary Upload Failed:", error);
    throw error;
  }
};

export default uploadOnCloudinary;
 