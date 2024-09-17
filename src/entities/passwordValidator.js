import Joi from "joi";

const passwordSchema = Joi.object({
    
    email: Joi.string().email().required(),

    password: Joi.string()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"))
    .required()
    .messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password cannot be empty",
        "string.pattern.base":
        "Password must be at least 8 characters long, one uppercase letter, one lowercase letter, one number, and one special character",
        "any.required": "Password is a required field",
    }),
  });

  export default passwordSchema