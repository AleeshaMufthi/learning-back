import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import { signInSchema, signUpSchema, signUpSchemaWithOtp } from "../../entities/authValidator.js";
import tutorService from "../../usecases/tutorService.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import passwordSchema from "../../entities/passwordValidator.js";

export const handleSignIn = asyncHandler(async (req, res) => {
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }
    const { tutorData, accessTokenTutor, refreshTokenTutor } = await tutorService.handleSignIn(value);
    attachTokenToCookie("accessTokenTutor", accessTokenTutor, res);
    attachTokenToCookie("refreshTokenTutor", refreshTokenTutor, res);
    res.status(200).json({ message: "Login successfull", tutor: tutorData });
  });

  export const handleSignUp = asyncHandler(async (req, res) => {
    const { error, value } = signUpSchemaWithOtp.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const tutor = await tutorService.handleSignUp(value);
    console.log("signed in");
    return res.status(200).json({ message: "Account created successfully" });
  });

  export const handleSignOtp = asyncHandler(async (req, res) => {
    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const otp = await tutorService.handleSignUpOtp(value);
    return res.status(200).json({ message: "Otp send successfully" });
  });

  export const handleForgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await tutorService.forgetPassword(email);
      
      // Assuming you redirect to an OTP page for user to input OTP
      res.status(200).json({
        message: "OTP sent to your email",
        userId: user._id,  // You might use this to track user in session
      });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  };

  export const handleResetPassword = async (req, res) => {
    try {
      console.log(req.body, 'body');
      
      // Extract validated values
      const { email, password } = req.body;
      
      await tutorService.resetPassword(email, password);
      console.log(email,'emaillll vannoo');
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  };


  export const restoreUserDetails = asyncHandler(async (req, res) => {
    if (!req.cookies["accessTokenTutor"] && req.cookies["refressTokenTutor"]) {
      const refreshToken = req.cookies["refreshTokenTutor"];
      if (!refreshToken) {
        throw AppError.authentication("provide a refresh token");
      }
      const accessToken = await tutorService.getAccessTokenByRefreshToken(
        refreshToken
      );
      attachTokenToCookie("accessTokenTutor", accessToken, res);
    }
    if (!req.cookies["accessTokenTutor"] && !req.cookies["refressTokenTutor"]) {
      return res
        .status(200)
        .json({ message: "access token not found", tutorData: null });
    }
  
    const tutorData = await tutorService.getTutorFromToken(
      req.cookies["accessTokenTutor"]
    );
    if (!tutorData) {
      res.clearCookie("refreshTokenTutor");
      res.clearCookie("accessTokenTutor");
    }
    return res.status(200).json({
      message: tutorData ? "tutor details found" : "tutor not found",
      tutorData,
    });
  });

  export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshTokenTutor"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    const accessToken = await tutorService.getAccessTokenByRefreshToken(
      refreshToken
    );
    attachTokenToCookie("accessTokenTutor", accessToken, res);
  
    res.status(200).json({ message: "token created successfully" });
  });

  export const handleLogout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshTokenTutor"];
    if (!refreshToken) console.log("refresh token not present in request");
  
    //delete refresh token from database
    const isTokenPresent = await tutorService.checkTokenAndDelete(refreshToken);
    if (!isTokenPresent) console.log("token not present in database");
  
    // clear cookie from response
    res.clearCookie("refreshTokenTutor");
    res.clearCookie("accessTokenTutor");
  
    res.status(200).json({ message: "logout successful" });
  });

  export default {
    handleSignIn,
    handleSignUp,
    handleSignOtp,
    handleForgetPassword,
    handleResetPassword,
    restoreUserDetails,
    refreshToken,
    handleLogout,
  }