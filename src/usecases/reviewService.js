import reviewRepo from "../adapters/repository/reviewRepo.js";

export const addReview = async (userId, courseId, rating, reviewText) => {
  // Check if the user has already reviewed this course
  const existingReview = await reviewRepo.findReviewByUserAndCourse(userId, courseId);
  
  if (existingReview) {
    // If review exists, return appropriate message with hasReviewed flag
    return { message: "Review already exists!", hasReviewed: true };
  }

  // Create a new review
  const reviewData = {
    userId,
    courseId,
    rating,
    reviewText,
  };

  // Save the review in the database
  await reviewRepo.createReview(reviewData);

  // Return success message with hasReviewed flag as false
  return { message: "Review added successfully!", hasReviewed: false };
};
  
export const getReviewsForCourse = async (courseId) => {
  return reviewRepo.getReviewsForCourse(courseId);
};

export const hasUserReviewedCourse = async (userId, courseId) => {
  // Check if a review exists for the given user and course
  const existingReview = await reviewRepo.findReviewByUserAndCourse(userId, courseId);
  return !!existingReview; // Return true if review exists, otherwise false
};

  
  export default  {
    addReview,
    getReviewsForCourse,
    hasUserReviewedCourse,
  };