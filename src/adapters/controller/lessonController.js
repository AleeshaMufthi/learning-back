import lessonService from "../../usecases/lessonService.js";
import createLessonSchema from '../../entities/lessonValidator.js'

export const addLessonToCourse = async (req, res) => {

  const start = Date.now(); // Start timer
  console.log(start,"Lesson creation started");

  const { value, error } = createLessonSchema.validate(req.body);
  if (error)
    return res.status(400).json({ message: error?.details[0]?.message });
  const lesson = {
    data: value,
    file: req.file,
    tutor: req.tutor,
  };
  const lessonData = await lessonService.addLessonToCourse(lesson);     
  console.log("Lesson added to service in", Date.now() - start, "ms");
  res.status(200).json({ message: "lesson added successfully", lesson: lessonData });
  console.log("Total time for lesson creation:", Date.now() - start, "ms");
};


export const getLesson = async (req, res) => {
    const lesson = await lessonService.getLesson(req.params.id);
    console.log(lesson, 'lesson from ctrl');
    
    return res.status(200).json({ message: "Get lesson Details", lesson });
  };
  
  
  export default {
    addLessonToCourse,
    getLesson,
  }