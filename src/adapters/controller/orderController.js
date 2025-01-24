import asyncHandler from "express-async-handler";
import orderService from "../../usecases/orderService.js";
import transactionService from "../../usecases/transactionService.js";
import walletService from "../../usecases/walletService.js";
import courseService from "../../usecases/courseService.js";

export const createOrder = asyncHandler(async (req, res) => {
    const response = await orderService.createOrder({
      userId: req.user._id,
      courseId: req.body.courseId,
      user: req.user.name,
    });
  
    res.status(200).json({
      message: "Order created successfully",
      data: {
        id: response.id, //id from razorpat
        currency: response.currency,
        amount: response.amount,
        orderId: response.orderId, //id stored db for the order
      },
    });
  });

  export const verifyPayment = asyncHandler(async (req, res) => {
    const data = transactionService.verifyPayment(req.body);
    if (data.signatureIsValid) {
      await orderService.updateOrderStatus(req.body.order_id_from_db);
      await courseService.enrollInCourse({
        courseId: req.body.course_id,
        userId: req.user._id,
      });
    }
    res.status(200).json(data);
  });

  export const getAllOrders = asyncHandler(async (req, res) => {
    const query = {
      page: Math.max(1, parseInt(req.query.page) || 1), // Ensure page is at least 1
      limit: Math.max(1, parseInt(req.query.limit) || 5), // Ensure limit is at least 1
      search: req.query.search?.trim() || "", // Trim whitespace
      sort: req.query.sort || "createdAt,desc", // Default sort by createdAt in descending order
    };
    const { orders, total } = await orderService.getAllOrders(req.user._id, query);
    res.status(200).json({
      message: "success",
      data: orders,
      total, // Include total for pagination
      currentPage: query.page, // Pass the current page for the frontend
      totalPages: Math.ceil(total / query.limit), // Calculate total pages
    });
  });
  

  
  export const cancelOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
      const order = await orderService.cancelOrder(orderId); 
      
      
      const wallet = await walletService.creditWallet(req.user._id, order.price);
      
      res.status(200).json({ message: "Order canceled and refund credited", balance: wallet.balance, order });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

export default {
    createOrder,
    verifyPayment,
    getAllOrders,
    cancelOrder,
}
  