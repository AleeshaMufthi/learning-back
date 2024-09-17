// Joi is a powerful validation library used to validate user input in applications.

import Joi from "joi";

const signInSchema = Joi.object({

    email: Joi.string()
    .email({
        minDomainSegments: 2,
        tlds: {allow: ["com", "net"]}
    })
    .required()
    .messages({
        "string.base": "Email Should be a type of Text",
        "String.empty": "Email is required",
        "string.email": "Email should be a valid email address",
        "any.required": "Email is required",
    }),

    password: Joi.string()
    .required()
    .messages({
        "string.base": "Password should be a type of text",
        "string.empty": "Password is required",
    })
})

const signUpSchema = Joi.object({
    name: Joi.string()
    .regex(/^[a-zA-Z][a-zA-Z\s]*$/)
    .min(3)
    .max(30)
    .required()
    .messages({
        "string.base": "Name should be a type of text",
        "string.empty": "Name cannot be empty",
        "string.min": "Name should have minimum length of {#limit}",
        "string.max": "Name should have maximum length of {#limit}",
        "string.pattern.base": "Name Shoud only contain charecters and spaces are not permitted on first",
        "any.required": "Name is a required field"
    }),
    email: Joi.string()
    .email({
        minDomainSegments: 2,
        tlds: {allow: ["com", "net"]},
    })
    .required()
    .messages({
        "string.base": "{{#label}} should be a type of text",
        "string.empty": "Email is required",
        "string.email": "Email should be a valid email address",
        "any.required": `Email is required`,
    }),

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

    confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .messages({
        "string.base": "Confirm password should be a type of text",
        "string.empty": "Confirm password cannot be empty",
        "any.required": "Confirm password is a required field",
        "any.only": "Confirm password must match the password",
    }),
    phone: Joi.string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.base": "Phone number should be a type of text",
        "string.empty": "Phone number is required",
        "string.length": "Phone number should contain ten characters",
        "string.pattern.base": "Phone number should only contain numbers",
        "any.required": "Phone is required field",
      }),
  });

const signUpSchemaWithOtp = signUpSchema.keys({
    otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.base": "OTP should be a type of text",
      "string.empty": "OTP cannot be empty",
      "string.length": "OTP should be exactly 6 characters long",
      "string.pattern.base": "OTP should only contain numbers",
      "any.required": "OTP is a required field",
    }),
})

export {
    signInSchema,
    signUpSchema,
    signUpSchemaWithOtp
}