import lessonService from "../../usecases/lessonService.js";
import createLessonSchema from '../../entities/lessonValidator.js'

export const addLessonToCourse = async (req, res) => {
    const { value, error } = createLessonSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error?.details[0]?.message });
    const lesson = {
      data: value,
      file: req.file,
      tutor: req.tutor,
    };
  
    const lessonData = await lessonService.addLessonToCourse(lesson);
    res.status(200).json({ message: "lesson added successfully" });
  };

export const getLesson = async (req, res) => {
    const lesson = await lessonService.getLesson(req.params.id);
    return res.status(200).json({ message: "lesson added successfully", lesson });
  };
  
  export default {
    addLessonToCourse,
    getLesson,
  }