import reviewService from "../../usecases/reviewService.js";

export const addReview = async (req, res) => {
  const { courseId } = req.params;
  const { rating, reviewText } = req.body;
  const userId = req.user._id;

  try {
    const { message, hasReviewed } = await reviewService.addReview(userId, courseId, rating, reviewText);
    res.status(201).json({ message, hasReviewed });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getReviews = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id; 

  try {
    // Get all reviews for the course
    const reviews = await reviewService.getReviewsForCourse(courseId);

    // Check if the user has already reviewed the course
    const hasReviewed = await reviewService.hasUserReviewedCourse(userId, courseId);

    // Send reviews and the hasReviewed flag
    res.status(200).json({ reviews, hasReviewed });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

  
  export default {
    addReview,
    getReviews,
  };