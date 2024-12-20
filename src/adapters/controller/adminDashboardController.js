import User from "../model/userModel.js";
import Tutor from "../model/tutorModel.js";
import Course from "../model/courseModel.js";
import Order from "../model/ordersModel.js";

export const getDashboardCounts = async (req, res) => {
    try {
      const users = await User.countDocuments();
      const tutors = await Tutor.countDocuments();
      const courses = await Course.countDocuments();
      const purchases = await Order.countDocuments();
  
      res.status(200).json({ users, tutors, courses, purchases });
    } catch (error) {
      res.status(500).json({ error: "Error fetching dashboard counts" });
    }
  };

export default {
    getDashboardCounts,
}