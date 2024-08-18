import mongoose from "mongoose";
import AppError from "../../framework/web/utils/appError.js";
import Otp from "../../framework/config/otp.js";
import OtpModel from "../model/otpModel.js";
import UserModel from "../model/userModel.js";

export const findOtpByEmail = async (data) => {
    try {
        const otp = await OtpModel.findOne({email: data.email})
        console.log(otp)
        return otp
    } catch (error) {
        console.log(error)
        throw AppError.database("An error occurred while retrieving OTP data.");
    }
}

export const createOtp = async(email, otp, count = 0 ) => {
    try{
        const otpModel = new OtpModel({ 
            email,
            otp,
            count,
        })
        await otpModel.save()
        console.log('Otp saved successfully');
        
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


export const verifyOtp = async (email, enteredOtp) => {
    try {
        const otpEntry = await OtpModel.findOne({ email });

        if (!otpEntry) {
            console.log(`No OTP entry found for email: ${email}`);
            throw AppError.authentication("No OTP found for this email"); 
        }
        if (otpEntry.otp !== enteredOtp) {
            console.log(`Stored OTP: ${otpEntry.otp}, Entered OTP: ${enteredOtp}`);
            throw AppError.authentication("OTP does not match"); 
        }
        return { message: "OTP verified successfully." };       
    } catch (error) {
        console.log("Error verifying OTP - ", error);
        throw AppError.database("An error occurred while verifying the OTP.");
    }
};


