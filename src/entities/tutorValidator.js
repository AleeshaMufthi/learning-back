import Joi from "joi";

const tutorDetailsSchema = Joi.object({
  name: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z\s]*$/)
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name cannot be empty",
      "string.min": "Name should have a minimum length of {#limit}",
      "string.max": "Name should have a maximum length of {#limit}",
      "string.pattern.base":
        "Name should only contain characters and space, and space is not permitted on first",
      "any.required": "'name' is a required field",
    }),
  about: Joi.string().optional().min(3).empty(""),
  age: Joi.number().integer().min(0).optional(),
  address: Joi.string().optional(),
  qualification: Joi.string().min(1).optional(),
});

export default tutorDetailsSchema