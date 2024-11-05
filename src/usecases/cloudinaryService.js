import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});

const uploaded = async (course, thumbnail) => {
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const courseTitleWithoutSpaces = course.title.trim().replace(/ /g, "-");
    const fileName = `thumbnail/${courseTitleWithoutSpaces}-${uniqueSuffix}`; // FileName for Cloudinary

    // Upload the file buffer as a stream to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: fileName },
        (error, result) => {
          if (error) {
            console.error("Error while uploading thumbnail to Cloudinary:", error);
            return reject(error);
          }
          console.log("Thumbnail uploaded to Cloudinary successfully.", result);
          resolve(result.secure_url);
        }
      );

      // Convert the buffer to stream and pipe it to Cloudinary
      streamifier.createReadStream(thumbnail.buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error while uploading thumbnail to Cloudinary:", error);
    return false;
  }
}; 

export default uploaded