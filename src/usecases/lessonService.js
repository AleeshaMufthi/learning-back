import courseService from "./courseService.js";
import lessonRepository from "../adapters/repository/lessonRepo.js";
import uploadVideo from "./cloudinaryVideoService.js";

  export const addLessonToCourse = async (lesson) => {
    const lessonKey = await uploadVideo(lesson);
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

    const data = await courseService.addLessonToCourse(
      lessonData._id,
      lesson.data.courseId
    );

    if (!data) {
      console.log("error while adding lesson to course");
      return false;
    }

    return  { success: true, lessonData, courseId: lesson.data.courseId };
  };
  
 export const getLesson = async (lessonId) => {
  let lesson = await lessonRepository.findLessonById(lessonId);
    console.log(lesson, 'lessoonnn');
  lesson = lesson.toObject();
  lesson.videoFormat = lesson.file.split(".")[1];
  lesson.videoURL = await uploadVideo(lesson);
  return lesson;
};

  export default {
    addLessonToCourse,
    getLesson,
  }