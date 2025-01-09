import mongoose from "mongoose";
import adminModel from "../model/adminModel.js";
import AppError from "../../framework/web/utils/appError.js";

export const findAdminByEmail = async(email) => {
  try {
    const admin = await adminModel.findOne({ email }).select({
      email: 1,
      name: 1,
      isBlocked: 1,
      password: 1,
      phone: 1,
    });
    return admin; // Ensure the result is returned
  } catch (err) {
    console.error("Error while querying database for Admin with email", email, err);
    throw err; // Re-throw the error if you need to handle it further up the call stack
  }
}

export const findAdminByPhone = async(phone) => await adminModel.findOne({ phone })

export const findAdminById = async(_id) => await adminModel.findOne({ _id })

export const findAdminByAdminname = async(adminname) => await adminModel.findOne({ adminname })

export const findAdminByToken = async(token) => {
    const adminData = await adminModel.findOne({token}).select({
        email: 1,
        name: 1,
        isBlocked: 1,
    })
    return adminData;
}

export const checkIsBlocked = async(email) => {
    const admin = await adminModel.findOne({ email }).select({
        isBlocked: 1,
    })
    return adminModel.isBlocked
}

export const createAdmin = ({ name, password, phone, email, adminname }) => {
    const admin = new adminModel({
      name,
      email,
      phone,
      password,
      adminname,
    });
  
    return admin
      .save()
      .then((response) => response)
      .catch((error) => {
        throw new AppError.database(
          "An error occured while processing your data"
        );
      });
  };

 export const addRefreshTokenById = async(_id, token) => {
    await adminModel.updateOne({_id},{$push: {token}})
  }

 export const findByTokenAndDelete = async(token) => {
    const isTokenPresent = await adminModel.findOneAndUpdate({token},{$pull: {token}})
    return isTokenPresent
  }

  export const updateAdminBalance = async (adminId, amount) => {
    return await adminModel.findByIdAndUpdate(adminId, { $inc: { balance: amount } }, { new: true });
  };

  export const findAdmin = async () => {
    return await adminModel.findOne();
  };

export default {
    findAdminByEmail,
    findAdminByPhone,
    findAdminById,
    findAdminByAdminname,
    findAdminByToken,
    checkIsBlocked,
    createAdmin,
    addRefreshTokenById,
    findByTokenAndDelete,
    updateAdminBalance,
    findAdmin,
}