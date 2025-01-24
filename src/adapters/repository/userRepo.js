import mongoose from "mongoose";
import userModel from "../model/userModel.js";
import AppError from "../../framework/web/utils/appError.js";
import { createAccessToken, createRefreshToken } from "../../framework/web/utils/generateTokens.js";

const findUserByEmail = async (email) => {
  try {
    return await userModel.findOne({ email })
    .select({ 
      email: 1, 
      name: 1, 
      password: 1, 
      phone: 1 });
  } catch (err) {
    throw err; 
  }
};  

const findUserByPhone = async (phone) => {
  try {
    return await userModel.findOne({ phone });
  } catch (err) {
    throw err;
  }
};
    
const findUserById = async (_id) => {
  try {
    return await userModel.findOne({ _id });
  } catch (err) {
    throw err; 
  }
};

const findUserByUserName = async (username) => {
  try {
    return await userModel.findOne({ username });
  } catch (err) {
    throw err;
  }
};

const findUserByUserId = async (userId) => {
  try {
    return await userModel.findById(userId)
      .select({ 
        email: 1, 
        name: 1, 
        phone: 1,
        username: 1,
        role: 1
      });
  } catch (err) {
    throw err;
  }
};


const ChangePasswordUpdate = async (userId, hashedPassword) => {
  try {
    return await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Database error while updating password");
  }
};

const checkIsBlocked = async (email) => {
  const user = await userModel.findOne({ email }).select({ isBlocked: 1 });
  return user.isBlocked;
};

const createUser = async ({ name, password, phone, email, username }) => {
  const user = new userModel({
    name,
    email,
    phone,
    password,
    username
  });

  return user
    .save()
    .then((response) => response)
    .catch((error) => {
      throw new AppError.database(
        "An error occured while processing your data"
      );
    });
};

const updatePassword = async ({ email, hashedPassword }) => {
    try{
     return await userModel.findOneAndUpdate(
      {email},
      {password: hashedPassword},
      { new: true}
     )
    }catch(error){
      throw new Error("Database error while updating user password")
    }
};

const getAllUser = async (query) => {
  const page = query.page || 0;
  const limit = query.limit || 5; 
  const search = query.search.trim();
  const users = await userModel.find({
    name: { $regex: search, $options: "i" },
  })
  .skip(page * limit) // Skip for pagination
  .limit(limit);
   const total = await userModel.countDocuments({
        name: { $regex: search, $options: "i" }, // Total count for matching search
  });
  return {users, total};
};

const blockUserById = async (_id) => {
  const isBlocked = await userModel.updateOne({ _id }, { isBlocked: true });
  return isBlocked;
};

const unblockUserById = async (_id) => {
  const isBlocked = await userModel.updateOne({ _id }, { isBlocked: false });
  return isBlocked;
};

const updateDetailsById = async ({ id, updateFields }) => {
  try {
    const updatedDetails = await userModel.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });
    return updatedDetails;
  } catch (error) {
    console.error("Database update failed:", error);
    throw AppError.database("Failed to update user details: " + error.message);
  }
};

const googleAuthUser = async (email, userInfo) => {
  try{
    const user = await userModel.findOne({ email },
      { email: 1, name: 1, password: 1, phone: 1, isBlocked: 1 })
    
    if(!user){
          const randomUsername = `user_${Math.random().toString(36).substring(7)}`;
          const randomPhone = `0000000000`; // Default or placeholder phone number
          const randomPassword = `google_${Math.random().toString(36).substring(7)}`;
       // User does not exist, create a new user with Google info
      const newUser = new userModel({
        name: userInfo.name,
        email: userInfo.email,
        username: randomUsername,
        phone: randomPhone,
        password: randomPassword,
    })

    await newUser.save();
    user = newUser

    }
    if(user.isBlocked){
      throw new Error("User is blocked");
    }
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const userInfoResponse = {
      username: user.name,
      email: user.email,
    };

    return { userInfo: userInfoResponse, accessToken, refreshToken }  

  }catch(error){
    throw new Error("Database error while google user authenticating")
  }
}

const getEnrolledCountById = async (courseId) => {
  const enrolledStudents = await userModel.countDocuments({
    enrolledCourses: { $in: [courseId] },
  });
  return enrolledStudents;
};

const findUserByCourseId = async ({ courseId, userId }) =>
  userModel.findOne({ _id: userId, enrolledCourses: { $in: [courseId] }});

const enrollInCourseById = async ({ courseId, userId }) => {
  const userData = await userModel.updateOne(
    { _id: userId },
    { $addToSet: { enrolledCourses: courseId } }
  );
  return userData;
};

const getTotalEnrolledCount = async (userId, query) => {
  // Filter for enrolled courses
  const filter = {
    _id: userId,
    "enrolledCourses.title": { $regex: query.search, $options: "i" }, // Search by course title
    "enrolledCourses.difficulty": { $in: query.difficulty },
    "enrolledCourses.category": { $in: query.category },
  };

  const user = await userModel.findOne(filter).populate("enrolledCourses");
  return user.enrolledCourses.length; // Total enrolled courses
};

const getCoursesEnrolled = async (userId, query) => {
  const page = parseInt(query.page || 0); // Default to page 0 if not provided
  const limit = parseInt(query.limit || 10); // Default limit to 10 if not provided
  const search = query.search || ""; // Search filter for course titles
  const sortField = query.sortField || "title"; // Default sort by title
  const sortOrder = query.sortOrder === "desc" ? -1 : 1; // Ascending or Descending order

  // Aggregation pipeline
  const coursesEnrolled = await userModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $project: { enrolledCourses: 1, _id: 0 } },
    {
      $lookup: {
        from: "courses",
        localField: "enrolledCourses",
        foreignField: "_id",
        as: "details",
      },
    },
    { $unwind: "$details" }, // Unwind details for filtering and sorting
    { 
      $match: { 
        "details.title": { $regex: search.trim(), $options: "i" }, // Search filter
      },
    },
    { 
      $sort: { [`details.${sortField}`]: sortOrder }, // Sort dynamically
    },
    { $skip: page * limit }, // Skip for pagination
    { $limit: limit }, // Limit for pagination
  ]);

  // Total count for pagination
  const totalCourses = await userModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $project: { enrolledCourses: 1, _id: 0 } },
    {
      $lookup: {
        from: "courses",
        localField: "enrolledCourses",
        foreignField: "_id",
        as: "details",
      },
    },
    { $unwind: "$details" },
    { 
      $match: { 
        "details.title": { $regex: search.trim(), $options: "i" }, 
      },
    },
    { $count: "total" },
  ]);

  const total = totalCourses[0]?.total || 0;

  return { courses: coursesEnrolled.map(item => item.details), total };
};


export {
  createUser,
  findUserByEmail,
  findUserByPhone, 
  findUserById,
  findUserByUserName,
  checkIsBlocked,
  updatePassword,
  getAllUser,
  findUserByUserId,
  blockUserById,
  unblockUserById,
  updateDetailsById,
  googleAuthUser,
  getEnrolledCountById,
  findUserByCourseId,
  enrollInCourseById,
  getCoursesEnrolled,
  getTotalEnrolledCount,
  ChangePasswordUpdate,
};
