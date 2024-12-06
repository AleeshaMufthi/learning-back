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
  res.status(200).json({ message: "lesson added successfully", lesson: lessonData });
};


export const getLesson = async (req, res) => {
    const lesson = await lessonService.getLesson(req.params.id);
    return res.status(200).json({ message: "Get lesson Details", lesson });
  };


// export const getLessonVideo = async (req, res) => {
//   console.log('ivde vanno')
//     try {
//       console.log(req.query,'req.queryyy')
//       const { id } = req.query;
      
//       const lesson = await lessonService.getLesson(id);
//       console.log(lesson, 'lesson from get lesson video');
      
  
//       if (!lesson || !lesson.file) {
//         return res.status(404).json({ message: "Leeson and Video not found" });
//       }
  
//       // Proxy the video to the client
//       const videoResponse = await fetch(lesson.file);
  
//       if (!videoResponse.ok) {
//         throw new Error("Failed to fetch video from Cloudinary");
//       }
  
//       // Set headers for the video response
//       res.setHeader("Content-Type", videoResponse.headers.get("Content-Type"));
//       res.setHeader("Content-Length", videoResponse.headers.get("Content-Length"));
  
//       // Pipe the video content to the client
//       videoResponse.body.pipe(res);
//     } catch (error) {
//       console.error("Error streaming video:", error);
//       res.status(500).json({ message: "Error streaming video" });
//     }
//   };
  
  
  export default {
    addLessonToCourse,
    getLesson,
    // getLessonVideo,
  }