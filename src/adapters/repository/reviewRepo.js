import reviewModel from "../model/reviewModel.js";

export const findReviewByUserAndCourse = (userId, courseId) => {
  return reviewModel.findOne({ userId, courseId });
};

export const createReview = (reviewData) => {
  const review = new reviewModel(reviewData);
  return review.save(); // This will return the saved review object
};

export const getReviewsForCourse = (courseId) => {
  return reviewModel.find({ courseId }).populate({
    path: 'userId', // Path to populate
    select: 'name thumbnail', // Fields to include from the user
  });;
};

  
export default {
    findReviewByUserAndCourse, 
    createReview,
    getReviewsForCourse,
  };