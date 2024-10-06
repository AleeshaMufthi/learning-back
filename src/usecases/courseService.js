import courseRepository from "../adapters/repository/courseRepo.js";
import AppError from "../framework/web/utils/appError.js";
import cloudinaryService from "./cloudinaryService.js";
import categoryRepository from "../adapters/repository/categoryRepo.js";
import { v2 as cloudinary } from "cloudinary";

export const courseCreate = async (file, value, tutor) => {

    let mediaUrl;
  
    mediaUrl = await cloudinaryService.uploaded(value, file); // Upload the file to Cloudinary (either image or video)
  
    if (!mediaUrl) {
      throw AppError.database("Error while uploading media file");
    }
  
    value.thumbnail = mediaUrl;
  
    const isCourseCreated = await courseRepository.createCourse(value, tutor._id);
    
    if (!isCourseCreated) {
      throw AppError.validation("Course creation failed");
    }
  
    return isCourseCreated;
  };



export const getAllCourseByTutor = async (tutorId) => {
    const courses = await courseRepository.getCoursesByTutorId(tutorId);
  
    for (let i = 0; i < courses.length; i++) {
      courses[i] = courses[i].toObject();
  
      courses[i].thumbnailURL = cloudinary.url(courses[i].thumbnail, {
        resource_type: "video" ? "video" : "image", // Assuming it's an image, change to "video" if needed
        secure: true, // Ensures secure URL (https)
      });
    }
  
    return courses;
  };



export const getCourseDetails = async (courseId) => {
    let course = await courseRepository.getCourseById(courseId);
    course = course.toObject();
  
    course.thumbnailURL = cloudinary.url(course.thumbnail, {
      resource_type: "video" ? "video" : "image", 
      secure: true, 
    });
  
    return course;
  };
  


export const addLessonToCourse = async (lessonId, courseId) => {
  let course = await courseRepository.addLessonToCourse(lessonId, courseId);
  return true;
};




export const getAllCourses = async () => {
  const courses = await courseRepository.getAllCourses();

  for (let i = 0; i < courses.length; i++) {
    courses[i] = courses[i].toObject();

    courses[i].thumbnailURL = cloudinary.url(courses[i].thumbnail, {
      resource_type: "video" ? "video" : "image", 
      secure: true, 
    });
  }

  return courses;
};



export const getAllCourseByFilter = async (query) => {
  query.difficulty =
    query.difficulty === "all"
      ? ["beginner", "intermediate", "advanced", "expert"]
      : query.difficulty.split(",");

  query.category =
    query.category === "all"
      ? await categoryRepository.getAllCategoriesTitle()
      : query.category.split(",");

  query.sort = query.reqSort ? query.reqSort.split(",") : [query.sort];
  query.sortBy = {};

  if (query.sort[1]) {
    query.sortBy[query.sort[0]] = query.sort[1];
  } else {
    query.sortBy[query.sort[0]] = "asc";
  }

  const total = await courseRepository.getCountByFilter(query);
  const courses = await courseRepository.getAllCourseByFilter(query);

  // Generate thumbnail URLs using Cloudinary
  const coursesWithURL = courses.map(course => {
    course = course.toObject();
    course.thumbnail = cloudinary.url(course.thumbnail, {
      resource_type: "video" ? "video" : "image", 
      secure: true,
    });
    return course;
  });

  return { total, courses: coursesWithURL };
};

export default {
  courseCreate,
  getAllCourseByTutor,
  getCourseDetails,
  addLessonToCourse,
  getAllCourses,
  getAllCourseByFilter
}