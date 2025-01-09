import AppError from "../../framework/web/utils/appError.js";
import Lesson from "../model/lessonModel.js";

export const addLessonToService = async (lesson) => {
    const lessonModel = new Lesson(lesson);
    const start = Date.now();
    const lessonData = await lessonModel.save().catch((err) => {
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