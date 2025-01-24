import Orders from "../model/ordersModel.js";
import AppError from "../../framework/web/utils/appError.js";

export const createOrder = async ({ userId, courseId, status, price }) => {
    const order = new Orders({
      user: userId,
      course: courseId,
      status,
      price,
    });
    return order
      .save()
      .then((response) => response)
      .catch((error) => {
        throw AppError.database();
      });
  };

  
export const updateOrderStatusById = async (_id, status) =>
    await Orders.findByIdAndUpdate({ _id }, { status });


export const findOrdersByUserId = async (filter, query) => {
  const { page, limit, sortBy } = query;
  const ordersQuery = Orders.find(filter)
    .select("-__v -updatedAt")
    .populate("course", "title tagline price")
    .sort(sortBy)
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Orders.countDocuments(filter); // Count based on the filter
  const orders = await ordersQuery;
  return { orders, total }; // Return both the orders and total count
};


export const findOrderById = async (orderId) => {
        try {
          const order = await Orders.findById(orderId); // Log the order fetched from DB
          return order;
        } catch (error) {
          console.error('Error fetching order from DB:', error.message);
          throw new CustomError(500, 'Database Error');
        }
      };
      
      export const updateOrderStatus = async (orderId, status) => {
        // Update only the status field in your database
        return await Orders.findByIdAndUpdate(orderId, { status }, { new: true });
    };

    export const updateOrderEnrolledStatus = async (orderId, enrolled) => {
      // Update only the enrolled field in your database
      return await Orders.findByIdAndUpdate(orderId, { enrolled }, { new: true });
  };

  export const findOrderByCourseId = async (orderId) => {
    return await Orders.findById(orderId).populate("course user");
  };

export default {
    createOrder,
    updateOrderStatusById,
    findOrdersByUserId,
    findOrderById,
    updateOrderStatus,
    updateOrderEnrolledStatus,
    findOrderByCourseId,
}