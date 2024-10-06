import courseService from "./courseService.js";
import lessonRepository from "../adapters/repository/lessonRepo.js";
import { v2 as cloudinary } from "cloudinary";

export const addLessonToCourse = async (lesson) => {
    try {
      const resourceType = lesson.file.mimetype.startsWith("video") ? "video" : "raw"; // Use "raw" for other file types
  
      const uploadResponse = await cloudinary.uploader.upload(lesson.file.path, {
        resource_type: resourceType,
        public_id: `lessons/${lesson.title.replace(/ /g, "-")}-${Date.now()}`, // Create a unique public ID
      });
  
      if (!uploadResponse) {
        console.log("Error while uploading lesson to Cloudinary");
        return false;
      }
  
      const lessonData = await lessonRepository.addLessonToService(lesson, uploadResponse.public_id);
  
      // Add the lesson to the course
      const data = await courseService.addLessonToCourse(lessonData._id, lesson.data.courseId);
  
      if (!data) {
        console.log("Error while adding lesson to course");
        return false;
      }
  
      return "success";
    } catch (error) {
      console.error("Error in addLessonToCourse:", error);
      return false;
    }
  };

  
 export const getLesson = async (lessonId) => {
    try {
      let lesson = await lessonRepository.findLessonById(lessonId);
      lesson = lesson.toObject();
      
      // Assuming the lesson has a field `videoKey` which contains the public ID for Cloudinary
      lesson.videoFormat = lesson.videoKey.split(".")[1];
  
      // Constructing the video URL using Cloudinary
      lesson.videoURL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload/${lesson.videoKey}`;
  
      return lesson;
    } catch (error) {
      console.error("Error in getLesson:", error);
      throw new Error("Lesson retrieval failed");
    }
  };

  export default {
    addLessonToCourse,
    getLesson,
  }