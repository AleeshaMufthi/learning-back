import courseService from "./courseService.js";
import lessonRepository from "../adapters/repository/lessonRepo.js";
import uploadVideo from "./cloudinaryVideoService.js";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

  export const addLessonToCourse = async (lesson) => {
    const lessonKey = await uploadVideo(lesson);
    if (!lessonKey) {
      return false;
    }
    const lessonDetials={
      title:lesson.data.title,
      description:lesson.data.description,
      courseId:lesson.data.courseId,
      file:lessonKey,
      tutor:lesson.tutor._id
    }
    const lessonData = await lessonRepository.addLessonToService(
      lessonDetials
    );

    const data = await courseService.addLessonToCourse(
      lessonData._id,
      lesson.data.courseId
    );

    if (!data) {
      return false;
    }
    return  { success: true, lessonData, courseId: lesson.data.courseId };
  };
  
 export const getLesson = async (lessonId) => {
  let lesson = await lessonRepository.findLessonById(lessonId);
  lesson = lesson.toObject();

  // lesson.videoFormat = lesson.file.split(".")[1];
  // lesson.videoURL = await uploadVideo(lesson);
  // return lesson;


  // Extract public_id from file URL
  const publicId = lesson.file
    .split("/")
    .slice(-2) // Keep last two segments (e.g., "lessons/Embedded-Servers...")
    .join("/")
    .split(".")[0]; // Remove the file extension


  // Generate a signed private URL
  try {
    lesson.videoURL = cloudinary.utils.private_download_url(publicId, "mp4", {
      resource_type: "video",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiry
    });

  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Could not generate video URL");
  }
  return lesson;
};

  export default {
    addLessonToCourse,
    getLesson,
  }