import { createCourseSchema } from '../../entities/courseValidator.js'
import { objectIdSchema } from '../../entities/idValidator.js'
import errorHandler from '../../framework/web/middlware/errorHandler.js'
import AppError from '../../framework/web/utils/appError.js'
import asyncHandler from 'express-async-handler'
import courseService from '../../usecases/courseService.js'
import userService from '../../usecases/userService.js'

export const handleCourseCreate = asyncHandler(async (req, res) => {
  console.log(req.body,'req.body');
  
  const { value, error } = createCourseSchema.validate(req.body);
  console.log(req.body,'validate req.body');
  
  if (error) {
    console.log(error,'erroorrrr');
    
    throw AppError.validation(error.details[0].message);
  }

  // Check if the file is present
  if (!req.file) {
    console.log(req.file,'file not recieved');
    
    throw AppError.validation("Thumbnail is required");
  }

  const course = await courseService.courseCreate(req.file, value, req.tutor);
  console.log(req.file,'req.fileee');
  console.log(value,'valueeee');
  console.log(req.tutor, 'req.tutor');
  
  
  
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
    console.log(query, "quueeeeeerrrrrryyyyyyyyyyyy");
    
    
    const courses= await courseService.getAllCourses();
    console.log(courses, 'quuueeerrrryyyyyyyyyy');
    return res
      .status(200)
      .json({ message: "Course found", data: courses });
  };

  export const courseDetials=async(req,res)=>{
    const {id}=req.params
    const data=await courseService.getOneCourseDetials(id)
    console.log(data)
    return res.status(200).json({message:"get course",data})
  }

  export const getSpecificCourse = async (req, res) => {
    console.log(req.params, "req..............paraammsss");
    const course = await courseService.getCourseDetails(req.params.id); 
    console.log(course, "couse from controllerrrrrrrrrrrrrrrrrr");
    const totalStudentsEnrolled = await userService.getEnrolledStudentsCount(
      req.params.id
    );
    console.log(totalStudentsEnrolled, "Total students enrolled");
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
    console.log(enrolledCourses);
    
    return res.status(200).json({ message: "success", data: enrolledCourses });
  };

  export const enrollValidation = async (req, res, next) => {
    const params = {
      courseId: req.params.id,
      userId: req.user._id,
    };
    const isEnrolled = await userService.isEnrolledForCourse(params);
    console.log(`Isssssssssssssss Enrolled: ${isEnrolled}`);
    if (isEnrolled) {
      next();
      return;
    }
    res.status(403).json({ error: "course not enrolled" });
  };

  const deleteCourseController = async (req, res) => {
    console.log(req.params,'req.paraammsss');
    console.log(req.params.id,'req.paraammsss.iiddd');

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
      console.log(req.params.id,"reqqqqqqqqqqqqqq.params.iddddddddd");
      console.log(req.body, "req.bodyyyyyyyyyyyyyyyyyyyyyyyyyyy");
      const courseId = req.params.id;
      const courseData = req.body;
      const updatedCourse = await courseService.updateCourse(courseId, courseData);
      console.log(updatedCourse, "updated courseeeeeeeee");
      
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