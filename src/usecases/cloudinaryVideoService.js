import { v2 as cloudinary } from "cloudinary";
import streamifier from 'streamifier'

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;

cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
    secure: true,
});

const uploadVideo = async (lesson) => {
  
    if (typeof lesson.file === 'string' && lesson.file.startsWith('http')) {
      return lesson.file; 
    }

  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const lessonTitleWithoutSpaces = lesson.data.title.trim().replace(/ /g, "-");

  const fileName = `lessons/${lessonTitleWithoutSpaces}-${uniqueSuffix}`;

  const uploadOptions = {
    public_id: fileName,
    resource_type: 'video',
    chunk_size: 6000000,  
    eager: [
      { width: 640, height: 360, crop: 'scale', quality: 'auto:low', audio_codec: 'aac' },
      { width: 1280, height: 720, crop: 'scale', quality: 'auto', audio_codec: 'aac' }
    ],
    eager_async: true,
  };

  return new Promise((resolve, reject) => {
    
    const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        console.error('Error while uploading video to Cloudinary:', error);
        return reject(error);
      }
      console.log('Video uploaded to Cloudinary successfully.', result);
      resolve(result.secure_url);
    });
   
    const bufferStream = streamifier.createReadStream(lesson.file.buffer);
    bufferStream.pipe(uploadStream);
  });
};

export default uploadVideo  