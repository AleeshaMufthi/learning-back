import { v2 as cloudinary } from "cloudinary";

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
    const extension = thumbnail.mimetype.split("/")[1];
    const resourceType = thumbnail.mimetype.startsWith("video") ? "video" : "image";
    const fileName = `thumbnail/${courseTitleWithoutSpaces}-${uniqueSuffix}.${extension}`;

    const uploadResponse = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: resourceType,
        public_id: fileName,
      }, (error, result) => {
        if (error) {
          reject(`Error uploading thumbnail: ${error.message}`);
        } else {
          resolve(result);
        }
      }).end(thumbnail.buffer); // Use buffer
    });

    console.log("Thumbnail uploaded to Cloudinary successfully.", uploadResponse);

    return uploadResponse.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error(`Error while uploading ${resourceType} thumbnail to Cloudinary:`, error);
    return false;
  }
};


export default uploaded