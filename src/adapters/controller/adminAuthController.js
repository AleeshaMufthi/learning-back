import { signInSchema, signUpSchema, signUpSchemaWithOtp } from "../../entities/authValidator.js";
import asyncHandler from "express-async-handler";
import AppError from "../../framework/web/utils/appError.js";
import adminService from "../../usecases/adminService.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";


export const handleSignIn = asyncHandler(async (req, res) => {
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }
    const { adminData, accessToken, refreshToken } =
      await adminService.handleSignIn(value);
    attachTokenToCookie("accessTokenAdmin", accessToken, res);
    attachTokenToCookie("refreshTokenAdmin", refreshToken, res);
    res.status(200).json({ message: "Login successfull", admin: adminData });
  });

  export const handleSignUp = asyncHandler(async (req, res) => {
    const { error, value } = signUpSchemaWithOtp.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const admin = await adminService.handleSignUp(value);
    console.log("signed in");
    return res.status(200).json({ message: "Account created successfully" });
  });

  export const handleSignOtp = asyncHandler(async (req, res) => {
    const { error, value } = signUpSchema.validate(req.body);
    if (error) {
      throw AppError.validation(error.details[0].message);
    }
    const otp = await adminService.handleSignUpOtp(value);
    return res.status(200).json({ message: "Otp send successfully" });
  });

  export const restoreAdminDetails = asyncHandler(async (req, res) => {
   
    const adminData = req.admin
    console.log(adminData, "tutordata from the controller");
    if (!adminData) {
      res.clearCookie("accessTokenAdmin");
      res.clearCookie("refreshTokenAdmin");
      return res
      .status(200)
      .json({ message: "Invalid token", adminData });
    }
    return res.status(200).json({
      message: adminData ? "admin details found" : "admin not found",
      adminData,
    });
  });

  export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshTokenAdmin"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    const accessToken = await adminService.getAccessTokenByRefreshToken(
      refreshToken
    );
    attachTokenToCookie("accessTokenAdmin", accessToken, res);
  
    res.status(200).json({ message: "token created successfully" });
  });

  export const handleLogout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshTokenAdmin"];
    if (!refreshToken) console.log("refresh token not present in request");
  
    //delete refresh token from database
    const isTokenPresent = await adminService.checkTokenAndDelete(refreshToken);
    if (!isTokenPresent) console.log("token not present in database");
  
    // clear cookie from response
    res.clearCookie("refreshTokenAdmin");
    res.clearCookie("accessTokenAdmin");
  
    res.status(200).json({ message: "logout successful" });
  });

  export default {
    handleSignIn,
    handleSignUp,
    handleSignOtp,
    restoreAdminDetails,
    handleLogout,
    refreshToken,
  }