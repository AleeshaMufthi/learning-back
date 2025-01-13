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

  // Check if the file is present
  if (!req.file) {
    
    throw AppError.validation("Thumbnail is required");
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
    const {courses, total} = await courseService.getAllCourses(query);
    
    return res
      .status(200)
      .json({ message: "Course found", data: courses, total });
  };

  export const courseDetials=async(req,res)=>{
    const {id}=req.params
    const data=await courseService.getOneCourseDetials(id)
    return res.status(200).json({message:"get course",data}) 
  }

  export const getSpecificCourse = async (req, res) => {
    const course = await courseService.getCourseDetails(req.params.id);
    const totalStudentsEnrolled = await userService.getEnrolledStudentsCount(
      req.params.id
    );
    course.totalStudentsEnrolled = totalStudentsEnrolled;
    
    res.status(200).json({ message: "course Found", data: course });
  };

  export const enrollCourse = async (req, res) => { 
    const { error } = objectIdSchema.validate(req.body.courseId);
    if (error) return res.status(400).json({ message: "invalid course id" });
    const params = {
      courseId: req.body.courseId,
      userId: req.user._id,
    };
    const isEnrolled = await courseService.enrollInCourse(params);
    res.status(200).json({
      message: "student enrolled for course successfully",
      data: req.body,
    });
  };

  export const getEnrolledCourses = async (req, res) => {    
    const enrolledCourses = await courseService.getEnrolledCourses(req.user._id);
    
    return res.status(200).json({ message: "success", data: enrolledCourses });
  };

  export const enrollValidation = async (req, res, next) => {
    const params = {
      courseId: req.params.id,
      userId: req.user._id,
    };
    const isEnrolled = await userService.isEnrolledForCourse(params);
    if (isEnrolled) {
      next();
      return;
    }
    res.status(403).json({ error: "course not enrolled" });
  };

  const deleteCourseController = async (req, res) => {

    const { id: courseId } = req.params;
    try {
      // Call the service to delete the course
      await courseService.deleteCourseService(courseId);
  
      // Send a success response
      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      // Handle errors (such as course not found)
      res.status(500).json({ error: error.message });
    }
  };

  export const updateCourse = async (req, res, next) => {
    try {
      const courseId = req.params.id;
      const courseData = req.body;
      const updatedCourse = await courseService.updateCourse(courseId, courseData);
      
      res.status(200).json({ data: updatedCourse });
    } catch (error) {
      next(error);
    }
  };


export default {
  getAllCourses,
  getAllCourseByTutor,
  handleCourseCreate,
  courseDetials,
  getSpecificCourse,
  enrollCourse,
  getEnrolledCourses,
  enrollValidation,
  deleteCourseController,
  updateCourse,
}