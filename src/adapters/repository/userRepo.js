import mongoose from "mongoose";
import userModel from "../model/userModel.js";

const findUserByEmail = async (email) => {
  try {
  const data=  await userModel.findOne({ email })
  return data 
  } catch (error) {
    console.log(error);
  }
};

const findUserById = async (_id) => await userModel.findOne({ _id });

const findByUserName = async (username) =>
  await userModel.findOne({ username });

const findUserByToken = async (token) => {
  const userData = userModel.findOne({ token }).select({
    email: 1,
    name: 1,
    isBlocked: 1,
  });
  return userData;
};

const createUser = async({ name, password, email}) => {
  const user = new userModel({
    name,
    email,
    password,
  });

  await user.save()
};

const addRefreshTokenById = async (_id, token) => {
  await User.updateOne({ _id }, { $push: { token } });
};

export {
  createUser,
  findUserByEmail, 
  findUserById,
  findByUserName,
  findUserByToken,
  addRefreshTokenById
};
