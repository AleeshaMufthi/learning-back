import orderRepo from "../adapters/repository/orderRepo.js";
import revenueRepo from "../adapters/repository/revenueRepo.js";
import adminRepo from "../adapters/repository/adminRepo.js";
import { updateTutorBalance } from "../adapters/repository/tutorRepo.js";

const handleOrderPayment = async (orderId) => {
    try {
      // Step 1: Find the order and course details
      const order = await orderRepo.findOrderByCourseId(orderId);
      
      if (!order) throw new Error("Order not found");
  
      const course = order.course;
      
      const tutor = course.tutor;
      
      const admin = await adminRepo.findAdmin();
      
  
      if (!tutor || !admin) throw new Error("Tutor or Admin not found");
  
      // Step 2: Calculate revenue share
      const totalAmount = order.price;
      
      const tutorShare = (totalAmount * 85) / 100; // 85% for tutor
      
      const adminShare = (totalAmount * 15) / 100; // 15% for admin
  
      // Step 3: Create a revenue record
      await revenueRepo.createRevenueRecord({
        tutorId: tutor._id,
        adminId: admin._id,
        courseId: course._id,
        orderId: order._id,
        tutorRevenue: tutorShare,
        adminRevenue: adminShare,
      });
     
      // Step 4: Update tutor and admin balances
      await updateTutorBalance(tutor._id, tutorShare);
      await adminRepo.updateAdminBalance(admin._id, adminShare);
      return { success: true, message: "Revenue distributed successfully." };
    } catch (error) {
      console.error("Error in handleOrderPayment:", error);
      return { success: false, message: error.message };
    }
  };

  const getAdminRevenueDetails = async () => {

    const revenues = await revenueRepo.findAllRevenues();
  
    const totalRevenue = revenues.reduce((acc, revenue) => acc + revenue.adminRevenue, 0);
  
    const formattedRevenues = revenues.map((rev) => ({
      courseTitle: rev.courseId?.title || 'Course Deleted',
      orderId: rev.orderId?._id || 'Unknown Order',
      adminRevenue: rev.adminRevenue,
      date: rev.createdAt,
    }));
  
    return { totalRevenue, formattedRevenues };
  };

  const getTutorRevenueDetails = async () => {
   
    const revenues = await revenueRepo.findAllRevenues();
  
    const totalRevenue = revenues.reduce((acc, revenue) => acc + revenue.tutorRevenue, 0);
  
    const formattedRevenues = revenues.map((rev) => ({
      courseTitle: rev.courseId?.title || 'Course Deleted',
      orderId: rev.orderId?._id || 'Unknown Order',
      tutorRevenue: rev.tutorRevenue,
      date: rev.createdAt,
    }));
  
    return { totalRevenue, formattedRevenues };
  };

  export default {
    handleOrderPayment,
    getAdminRevenueDetails,
    getTutorRevenueDetails,
  }