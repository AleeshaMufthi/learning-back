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

// Function to upload images to Cloudinary
const uploadImage = async (file) => {
    try {
        if (!file || !file.buffer) {
            throw new Error("File is missing or invalid");
        }

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `users/profile-${uniqueSuffix}`; // Organize images by user

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { public_id: fileName },
                (error, result) => {
                    if (error) {
                        console.error("Error while uploading image to Cloudinary:", error);
                        return reject(error);
                    }
                    console.log("Image uploaded to Cloudinary successfully.", result);
                    resolve(result.secure_url);
                }
            );

            // Convert the buffer to stream and pipe it to Cloudinary
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    } catch (error) {
        console.error("Error while uploading image to Cloudinary:", error);
        throw error;
    }
};

export default uploadImage;
