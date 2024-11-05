import courseRepository from "../adapters/repository/courseRepo.js";
import AppError from "../framework/web/utils/appError.js";
import uploaded from '../usecases/cloudinaryService.js'
import categoryRepository from "../adapters/repository/categoryRepo.js";
import { enrollInCourseById, getCoursesEnrolled } from "../adapters/repository/userRepo.js";
import { v2 as cloudinary } from "cloudinary";

export const courseCreate = async (file, value, tutor) => {
  const thumbnailUrl = await uploaded(value, file); // Upload the file to Cloudinary

  if (!thumbnailUrl) {
    console.log('Cloudinary upload failed');
    
    throw AppError.database("Error while uploading media file");
  }

  value.thumbnail = thumbnailUrl; // Set the actual Cloudinary URL to the course's thumbnail field

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
    console.log(course, 'courseeeeee');
    if(course){
      course = course.toObject();
    
      course.thumbnail = cloudinary.url(course.thumbnail, {
        resource_type: "video" ? "video" : "image", 
        secure: true, 
      });   
    }

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
export const getOneCourseDetials=async (courseId)=>{
  const course = await courseRepository.getCourse(courseId);
  return course
}

export const enrollInCourse = async ({ courseId, userId }) => {
  const isValidCourse = await courseRepository.findCourseById(courseId);
  if (!isValidCourse) {
    return false;
  }
const isEnrolled = await enrollInCourseById({
    courseId,
    userId,
  });
  return isEnrolled;
};

export const getEnrolledCourses = async (userId) => {  
  const coursesEnrolled = await getCoursesEnrolled(userId);
  
  for (let i = 0; i < coursesEnrolled.length; i++) {
    coursesEnrolled[i].thumbnailURL = cloudinary.url(coursesEnrolled[i].thumbnail, {
      resource_type: "video" ? "video" : "image",
      secure: true, 
    });
  }  
  console.log(coursesEnrolled,"==================================");
  
  return coursesEnrolled;
};

export const getAllCourseCountByTutor = async (tutorId) => {
  const courses = await courseRepository.getCoursesCountByTutorId(tutorId);
  for (let i = 0; i < courses.length; i++) {
    courses[i] = courses[i].toObject();
    courses[i].thumbnailURL = await uploaded.getThumbnailURL(
      courses[i].thumbnail
    );
  }
  return courses;
};

const deleteCourseService = async (courseId) => {
  // Check if the course exists
  const course = await courseRepository.getCourse(courseId);
  if (!course) {
    throw new Error('Course not found');
  }
  // Perform the delete operation 
  await courseRepository.deleteCourseRepo(courseId);
  return { message: 'Course deleted successfully' };
};

export const updateCourse = async (courseId, courseData) => {
  const course = await courseRepository.findCourseById(courseId);
  if (!course) {
    throw new CustomError(404, "Course not found");
  }
  const updatedCourse = await courseRepository.updateCourseById(courseId, courseData);
  return updatedCourse;
};

export default {
  courseCreate,
  getAllCourseByTutor,
  getCourseDetails,
  addLessonToCourse,
  getAllCourses,
  getAllCourseByFilter,
  getOneCourseDetials,
  enrollInCourse,
  getEnrolledCourses,
  getAllCourseCountByTutor,
  deleteCourseService,
  updateCourse,
}