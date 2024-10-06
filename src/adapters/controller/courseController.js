import { createCourseSchema } from '../../entities/courseValidator.js'
import { objectIdSchema } from '../../entities/idValidator.js'
import errorHandler from '../../framework/web/middlware/errorHandler.js'
import AppError from '../../framework/web/utils/appError.js'
import asyncHandler from 'express-async-handler'
import courseService from '../../usecases/courseService.js'
import userService from '../../usecases/userService.js'

export const handleCourseCreate = asyncHandler(async (req, res) => {
    const { value, error } = createCourseSchema.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const course = await courseService.courseCreate(req.file, value, req.tutor);
    return res.status(200).json({ message: "course created successfully" });
  });


export const getAllCourseByTutor = async (req, res) => {
    if (!req.tutor._id) throw AppError.validation("error");
    const courses = await courseService.getAllCourseByTutor(req?.tutor._id);
    return res.status(200).json({ message: "courses found", data: courses });
  };

export const getAllCourses = async (req, res) => {
    let query = {
      page: parseInt(req.query.page) - 1 || 0,
      limit: parseInt(req.query.limit) || 5,
      search: req.query.search || "",
      difficulty: req.query.difficulty || "all",
      sort: req.query.sort || "createdAt",
      category: req.query.category || "all",
      reqSort: req.query.sort,
    };
    const { courses, total } = await courseService.getAllCourseByFilter(query);
    return res
      .status(200)
      .json({ message: "Course found", total, data: courses });
  };


export default {
  getAllCourses,
  getAllCourseByTutor,
  handleCourseCreate,
}