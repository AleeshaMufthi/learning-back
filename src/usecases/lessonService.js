import courseService from "./courseService.js";
import lessonRepository from "../adapters/repository/lessonRepo.js";
import uploadVideo from "./cloudinaryVideoService.js";
import fetch from "node-fetch";
import { v2 as cloudinary } from "cloudinary";

  export const addLessonToCourse = async (lesson) => {
    const start = Date.now();
    console.log("Video upload started");
    const lessonKey = await uploadVideo(lesson);
    console.log("Video upload completed in", Date.now(), "ms");
    if (!lessonKey) {
      console.log("error while uploading lesson to cloudinary");
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
    console.log("Lesson details saved to database in", Date.now() - start, "ms");

    const data = await courseService.addLessonToCourse(
      lessonData._id,
      lesson.data.courseId
    );
    console.log("Lesson added to course in", Date.now() - start, "ms");

    if (!data) {
      console.log("error while adding lesson to course");
      return false;
    }
    console.log("Total time for addLessonToCourse:", Date.now() - start, "ms");
    return  { success: true, lessonData, courseId: lesson.data.courseId };
  };
  
 export const getLesson = async (lessonId) => {
  let lesson = await lessonRepository.findLessonById(lessonId);
  console.log(lesson, 'lesson from service');
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

  console.log("Extracted Public ID:", publicId);

  // Generate a signed private URL
  try {
    lesson.videoURL = cloudinary.utils.private_download_url(publicId, "mp4", {
      resource_type: "video",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1-hour expiry
    });

    console.log("Generated Signed Video URL:", lesson.videoURL);
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