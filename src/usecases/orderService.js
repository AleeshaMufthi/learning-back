import orderRepository from "../adapters/repository/orderRepo.js";
import courseRepository from "../adapters/repository/courseRepo.js";
import transactionService from "./transactionService.js";
import AppError from "../framework/web/utils/appError.js";

export const createOrder = async ({ courseId, userId, user }) => {
    const { price, title: courseTitle } = await courseRepository.findCourseById(
      courseId
    );
  
    if (!price) {
      throw AppError.database();
    }
    const { _id: orderId } = await orderRepository.createOrder({
      userId: userId,
      courseId: courseId,
      status: "pending",
      price: price,
    });
    const orderDetails = await transactionService.generateRazorPayOrder({
      price,
      userId,
      user,
      courseTitle,
      courseId,
      orderId: orderId.toString(),
    });
    return { ...orderDetails, orderId };
  };

  export const updateOrderStatus = async (orderId) => {
    const status = "completed";
    const isUpdated = await orderRepository.updateOrderStatusById(
      orderId,
      status
    );
    return isUpdated;
  };

  
  export const getAllOrders = async (userId, query = {}) => {
    const { page, limit, search, sort } = query;
  
    // Build the filter
    const filter = {
      user: userId,
      ...(search && {
        $or: [
          { "course.title": { $regex: search, $options: "i" } }, // Search in course title
          { "course.tagline": { $regex: search, $options: "i" } }, // Search in course tagline
        ],
      }),
    };
  
    // Parse sort options
    const [sortField, sortOrder] = sort.split(",");
    const sortBy = { [sortField]: sortOrder === "desc" ? -1 : 1 };
  
    // Call repository to fetch orders and total count
    return await orderRepository.findOrdersByUserId(filter, {
      page,
      limit,
      sortBy,
    });
  };
  
  

  export const cancelOrder = async (orderId) => {
    try {
  
      const order = await orderRepository.findOrderById(orderId);
      if (!order) {
        throw new CustomError(404, "Order not found");
      }
  
      // Check if the order is within 7 days
      const OneDaysInMs = 24 * 60 * 60 * 1000;
      const currentTime = new Date();
      const orderTime = new Date(order.createdAt);
      
      if (currentTime - orderTime > OneDaysInMs) {
        throw new CustomError(400, "Cancellation period has expired( 5 days)");
      }
  
      await orderRepository.updateOrderStatus(orderId, 'canceled');
      await orderRepository.updateOrderEnrolledStatus(orderId, false);

      const updatedOrder = await orderRepository.findOrderById(orderId);
  
      return updatedOrder
       
    } catch (error) {
      console.error('Error in cancelOrder service:', error.message);  // Log error details
      throw error;  // Re-throw the error to be caught in the controller
    }
  };
  

  export default {
    createOrder,
    updateOrderStatus,
    getAllOrders,
    cancelOrder,
  }