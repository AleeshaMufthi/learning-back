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
        console.log("Error while creating new order : ", error);
        throw AppError.database();
      });
  };

export const updateOrderStatusById = async (_id, status) =>
    await Orders.findByIdAndUpdate({ _id }, { status });

export const findOrdersByUserId = async (userId) =>
    await Orders.find({ user: userId })
      .select("-__v -updatedAt")
      .populate("course", "title tagline price");

      export const findOrderById = async (orderId) => {
        try {
          const order = await Orders.findById(orderId);
          console.log('Order fetched from DB:', order);  // Log the order fetched from DB
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

export default {
    createOrder,
    updateOrderStatusById,
    findOrdersByUserId,
    findOrderById,
    updateOrderStatus,
    updateOrderEnrolledStatus,
}