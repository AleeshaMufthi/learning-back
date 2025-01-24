import { objectIdSchema } from "../../entities/idValidator.js";
import userDetailsSchema from "../../entities/userValidator.js";
import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import userService from "../../usecases/userService.js";

export const getAllUsers = async (req, res) => {
  let query = {
    page: parseInt(req.query.page) - 1 || 0,
    limit: parseInt(req.query.limit) || 5, 
    search: req.query.search || "",
  };
  const {users, total} = await userService.getAllUsers(query);
  return res.status(200).json({ message: "users found", data: users, total });
};

export const blockUser = async (req, res) => {
    const isBlocked = await userService.blockUser(req.body.userId);
    return res.status(200).json({ message: "User Blocked Successfully" });
  };

export const unblockUser = async (req, res) => {
    const isBlocked = await userService.unblockUser(req.body.userId);
    return res.status(200).json({ message: "User unBlocked successfully" });
  };

export const getUserDetails = asyncHandler(async (req, res) => {
    const { value, error } = objectIdSchema.validate(req.user?._id);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const userDetails = await userService.getUserDetails(value);
    
    return res.status(200).json({ message: "user details found", userDetails });
  });


  export const updateUserDetails = asyncHandler(async (req, res) => {
    console.log("File:", req.file); 
    console.log("Body:", req.body); 

    const updateData = {
      ...req.body,
      _id: req.user._id,
    };
  
    if (req.file) {
      updateData.thumbnail = req.file; 
    }
  
    const userData = await userService.updateUserDetails(updateData);
  
    console.log(userData, "Updated User Data");

    res
      .status(200)
      .json({ message: "User details updated successfully", data: userData });
  });
  

export const handleChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    console.log(req.body, 'req.body');
    
    const userId = req.user._id; // Assumes `isAuthUser` middleware attaches `user` to the `req`

    // Call the service to change the password
    const data = await userService.changePassword(userId, currentPassword, newPassword);
    return res.status(200).json({ message: "Password changed successfully", data });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};


  export const checkCourseEnrolled = async (req, res) => {
    if (!req.user) {
      return res
        .status(200)
        .json({ message: "user is not logged in", enrolled: false });
    }
    const params = {
      courseId: req.params.id,
      userId: req.user._id,
    };
    const isEnrolled = await userService.isEnrolledForCourse(params);
    return res.status(200).json({
      message: isEnrolled
        ? "user is already enrolled for this course"
        : "user is not enrolled for this course",
      enrolled: isEnrolled,
    });
  };

  export default {
    getAllUsers,
    blockUser,
    unblockUser,
    getUserDetails,
    updateUserDetails,
    handleChangePassword,
    checkCourseEnrolled,
  }

