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
    console.log("Error querying database for user with email", email, err);
    throw err; 
  }
};  

const findUserByPhone = async (phone) => {
  try {
    return await userModel.findOne({ phone });
  } catch (err) {
    console.log("Error querying database for user with phone", phone, err);
    throw err;
  }
};
    
const findUserById = async (_id) => {
  try {
    return await userModel.findOne({ _id });
  } catch (err) {
    console.log("Error querying database for user with ID", _id, err);
    throw err; 
  }
};

const findUserByUserName = async (username) => {
  try {
    return await userModel.findOne({ username });
  } catch (err) {
    console.log("Error querying database for user with username", username, err);
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
    console.log("Error querying database for user with id", userId, err);
    throw err;
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
      console.log("Error saving user data to database - ", error);
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




const getAllUser = async () => {
  const users = await userModel.find();
  return users;
};

const blockUserById = async (_id) => {
  const isBlocked = await userModel.updateOne({ _id }, { isBlocked: true });
  return isBlocked;
};

const unblockUserById = async (_id) => {
  const isBlocked = await userModel.updateOne({ _id }, { isBlocked: false });
  return isBlocked;
};

const updateDetailsById = async (user) => {
  const updateFields = {
    name: user.name,
    age: user.age,
    about: user.about,
    address: user.address,
    visible: user.visible,
    thumbnail: user.thumbnail,
  };
  
  const updatedUser = await userModel.updateOne(
    { _id: user._id },
    { $set: updateFields }
  );
  return updatedUser;
};

const googleAuthUser = async (email, userInfo) => {
  try{
    const user = await userModel.findOne({ email }, { email: 1, name: 1, password: 1, phone: 1, isBlocked: 1 })
    if(!user){
       // User does not exist, create a new user with Google info
      const newUser = new userModel({
      name: userInfo.name,
      email: userInfo.email,
    })

    await newUser.save();
    user = newUser

    }
    if(user.isBlocked){
      console.log("Access Denied: User is blocked"); 
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

const getCoursesEnrolled = async (userId) => {
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
    { $project: { details: 1 } },
  ]);
  return coursesEnrolled[0].details;
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
};
