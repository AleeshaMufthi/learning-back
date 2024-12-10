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
    // Respond to the client immediately
    res.status(202).json({ message: "Lesson upload started, please wait." });

  // const lessonData = await lessonService.addLessonToCourse(lesson);
  process.nextTick(async () => {
    try {
      const lessonData = await lessonService.addLessonToCourse(lesson);
      console.log("Lesson processed:", lessonData);
      res.status(200).json({ message: "lesson added successfully", lesson: lessonData });
    } catch (err) {
      console.error("Error while processing lesson:", err);
    }
  });
};


export const getLesson = async (req, res) => {
    const lesson = await lessonService.getLesson(req.params.id);
    return res.status(200).json({ message: "Get lesson Details", lesson });
  };
  
  
  export default {
    addLessonToCourse,
    getLesson,
  }