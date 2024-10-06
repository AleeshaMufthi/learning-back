import AppError from "../../framework/web/utils/appError.js";
import Lesson from "../model/lessonModel.js";

export const addLessonToService = async (lesson, lessonKey) => {
    const lessonModel = new Lesson({
      title: lesson.data.title,
      course: lesson.data.courseId,
      description: lesson.data.description,
      videoKey: lessonKey,
      duration: 20,
      order: 0,
    });

    const lessonData = await lessonModel.save().catch((err) => {
      console.log("error while saving lesson", err);
      return false;
    });
    return lessonData;
  };

  export const findLessonById = async (lessonId) => {
    const lesson = Lesson.findById({ _id: lessonId });
    return lesson;
  }

  export default {
    findLessonById,
    addLessonToService,
  }