import AppError from "../../framework/web/utils/appError.js";
import Course from "../model/courseModel.js";
import mongoose from "mongoose";

export const createCourse = async (courseData, tutorId) => {
    const course = new Course({
      title: courseData.title,
      about: courseData.about,
      tutor: tutorId,
      category: courseData.category,
      difficulty: courseData.difficulty,
      tagline: courseData.tagline,
      thumbnail: courseData.thumbnail,
      price: courseData.price,
    });
    return course
      .save()
      .then((response) => response)
      .catch((error) => {
        throw new AppError.database(
          "An error occured while processing your data"
        );
      });
  };

  export const getCoursesByTutorId = async (tutorId) => {
    const courses = await Course.find({ tutor: tutorId }).catch((err) => {
    });
    return courses;
  };

  export const getCourseById = async (courseId) => {
    try {
      
      const course = await Course.findOne({ _id: courseId })
        .populate("lessons")     // Populate the lessons field
        .populate("tutor"); // Populate the tutor's name field
      
      return course;
    } catch (err) {
      return null;  
    }
  };

  export const addLessonToCourse = async (lessonId, courseId) => {
    await Course.findOneAndUpdate(
      { _id: courseId },
      {  $addToSet: { lessons: lessonId } }
    );
    return true;
  };

  export const getAllCourses = async (query) => {
    const courses = await Course.find({
      title: { $regex: query.search.trim(), $options: "i" },
    })
      .select("-__v") 
      .sort(query.sortBy)
      .skip(query.page * query.limit)
      .limit(query.limit);
  
    return courses;
  };

  export const getCountByFilter = async ({ search, category, difficulty }) => {
    const total = await Course.countDocuments();
  
    return total;
  };
  

  export const findCourseById = async (courseId) => {
    const course = await Course.findById({ _id: courseId }).select("-__v");
    
    if (!course) {
      return false;
    }
    return course;
  };

  export const getAllCourseByFilter = async (query) => {
    const courses = await Course.find({
      title: { $regex: query.search.trim(), $options: "i" },
    })
      .select("-__v")
      .where("category")
      .in(query.category)
      .where("difficulty")
      .in(query.difficulty)
      .sort(query.sortBy)
      .skip(query.page * query.limit)
      .limit(query.limit);
  
    return courses;
  };

  export const getCourse=async(courseId)=>{
    const course=await Course.findById(courseId)
    return course
  }
  
  const deleteCourseRepo = async (courseId) => {
    try {
      const deletedCourse = await Course.findByIdAndDelete(courseId);
      if (!deletedCourse) {
        console.log('Course not found for deletion');
      } else {
        console.log('Course deleted:', deletedCourse);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  export const updateCourseById = async (id, courseData) => {
    const updatedCourse =  Course.findByIdAndUpdate(id, courseData, { new: true });
    return updatedCourse
  };

  export default {
    createCourse,
    getCoursesByTutorId,
    getCourseById,
    addLessonToCourse,
    getAllCourses,
    findCourseById,
    getAllCourseByFilter,
    getCountByFilter,
    getCourse,
    deleteCourseRepo,
    updateCourseById,
  }
