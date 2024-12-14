import courseService from "./courseService.js";
import lessonRepository from "../adapters/repository/lessonRepo.js";
import uploadVideo from "./cloudinaryVideoService.js";
import fetch from "node-fetch";

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
  lesson = lesson.toObject();
  lesson.videoFormat = lesson.file.split(".")[1];
  lesson.videoURL = await uploadVideo(lesson);
  return lesson;
};

  export default {
    addLessonToCourse,
    getLesson,
  }