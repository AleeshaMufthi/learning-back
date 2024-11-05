import Joi from "joi";

const createLessonSchema = Joi.object({
    title: Joi.string().min(3).max(50).required().messages({
      "string.base": "Title should be a type of text",
      "string.empty": "Title is required",
      "string.min": "Title should have a minimum length of 3",
      "string.max": "Title should have a maximum length of 50",
    }),
    courseId: Joi.string().required().messages({
      "string.empty": "Course ID is required",
    }),
  
    description: Joi.string().required(),
  }).required();

  export default createLessonSchema

  