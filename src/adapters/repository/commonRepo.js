import mongoose from "mongoose";
import AppError from "../../framework/web/utils/appError.js";
import OTP from "../../framework/config/otp.js";
import OtpModel from "../model/otpModel.js";
import UserModel from "../model/userModel.js";


export const findOtpByEmail = async (email) => {
  try {
      const otp = await OtpModel.findOne({email})
      console.log(otp,'Retrieved otp')
      return otp
  } catch (error) {
      console.log(error)
      throw AppError.database("An error occurred while retrieving OTP data.");
  }
}

export const createOtp = async({ phone, email, otp}) => {
  try{
      const otpModel = new OtpModel({ 
          phone,
          email,
          otp,
          count: 1,
      })
      return await otpModel.save()   
  }catch(error){ 
      console.log("Error saving OTP data to the database - ", error);
      throw AppError.database("An error occurred while processing your data.");
  }
}


export const updateOtp = async ({ isEmailOtp }) => {
  try{
      const updatedOtp = await OtpModel.findOneAndUpdate(
          { email: isEmailOtp.email },
          { 
              $set: { count: isEmailOtp.count, otp: isEmailOtp.otp } 
          },
          { new: true }
      );
      return updatedOtp;
  }catch(error){
      console.log("Error saving OTP data to database - ", error);
      throw AppError.database("An error occurred while processing your data")
  }
}


