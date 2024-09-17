import { objectIdSchema } from "../../entities/idValidator.js";
import userDetailsSchema from "../../entities/userValidator.js";
import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import userService from "../../usecases/userService.js";

export const getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  return res.status(200).json({ message: "users found", data: users });
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
    const { value, error } = userDetailsSchema.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const userData = await userService.updateUserDetails({
      ...value,
      _id: req.user._id,
    });
    res
      .status(200)
      .json({ message: "user details updated successfully", data: userData });
  });

  export default {
    getAllUsers,
    blockUser,
    unblockUser,
    getUserDetails,
    updateUserDetails,
  }