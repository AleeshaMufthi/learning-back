import lessonService from "../../usecases/lessonService.js";
import createLessonSchema from '../../entities/lessonValidator.js'

export const addLessonToCourse = async (req, res) => {

  const start = Date.now(); // Start timer

  const { value, error } = createLessonSchema.validate(req.body);
  console.log(req.body,"lesson creation")
  if (error)
    return res.status(400).json({ message: error?.details[0]?.message });
  const lesson = {
    data: value,
    file: req.file,
    tutor: req.tutor,
  };
  const lessonData = await lessonService.addLessonToCourse(lesson); 
  console.log(lessonData,"lesson-Data");
      
  res.status(200).json({ message: "lesson added successfully", lesson: lessonData });
};


export const getLesson = async (req, res) => {
    const lesson = await lessonService.getLesson(req.params.id);
    return res.status(201).json({ message: "Get lesson Details", lesson });
  };
  
  
  export default {
    addLessonToCourse,
    getLesson,
  }