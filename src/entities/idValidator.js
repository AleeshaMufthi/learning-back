import Joi from "joi";

export const objectIdSchema = Joi.string().required().messages({
    "string.empty": "ID is required",
  });

