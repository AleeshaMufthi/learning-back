import {  signInSchema, signUpSchema, signUpSchemaWithOtp } from "../../entities/authValidator.js";
import passwordSchema from "../../entities/passwordValidator.js";
import asyncHandler from "express-async-handler";
import userService from '../../usecases/userService.js'
import AppError from "../../framework/web/utils/appError.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";

export const handleLogIn = asyncHandler(async (req, res) => {
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      console.log(error);
      throw AppError.validation(error.details[0].message);
    }
    const { user, accessToken, refreshToken } = await userService.handleSignIn(
      value
    );
    attachTokenToCookie("accessToken", accessToken, res);
    attachTokenToCookie("refreshToken", refreshToken, res);
    console.log("Login successful for user - ", user.name);
    res.status(200).json({ message: "Login successfull", user });
  });

export const handleRegister = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchemaWithOtp.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const user = await userService.handleSignUp(value);
  console.log(
    "New User has been registered -",
    value.name,
    "with email - ",
    value.email,
    "with phone number ",
    value.phone
  );
  return res.status(200).json({ message: "Account created successfully" });
  });



export const handleSignOtp = asyncHandler(async (req, res) => {
  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
  const otp = await userService.handleSignUpOtp(value);
  return res.status(200).json({ message: "Otp send successfully" });
  })

export const handleForgetPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userService.forgetPassword(email);
      
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
      
      // Extract validated values
      const { email, password } = req.body

      await userService.resetPassword(email, password);
      
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  };

export const restoreUserDetails = asyncHandler(async (req, res) => { 
  try {
    const userData = req.user
    
    if (!userData) {
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken"); 
      return res.status(200).json({
        message: "User not found",
        userData
      });
    }
    return res.status(200).json({
      message: "User details found",
      userData
    });
  } catch (err) {
    console.error("Error restoring user details:", err);
  }
  });


  export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    
    if (!refreshToken) {
      throw AppError.authentication("Refresh token is missing");
    }
    try{
      const { user, accessToken } = await userService.getAccessTokenByRefreshToken(
        refreshToken
      );
      attachTokenToCookie("accessToken", accessToken, res);
      res.status(200).json({ accessToken, message: "token refresh successfully" });
    }catch(error){
    console.error("Error refreshing token:", error);
    return res.status(401).json({message: "Invalid refresh token", name: "AuthenticationError"});
    }
  });

  export const handleLogout = asyncHandler(async (req, res) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
  
    res.status(200).json({ message: "logout successful" });
  });

  export const loginGoogleAuth = asyncHandler(async (req, res) => {
    const { email, name } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const userInfo = { email, name}
    const data = await userService.googleAuthValidate(email, userInfo)

    if (data) {
      attachTokenToCookie("accessToken", data.accessToken, res);
      attachTokenToCookie("refreshToken", data.refreshToken, res);

      res.status(200).json({ message: 'Login successful', token: 'your-generated-token', user: data });
    } else {
      res.status(400).json({ message: 'User authentication failed' });
    }
})  

  export default {
    handleLogIn,
    handleRegister,
    handleSignOtp,
    restoreUserDetails,
    refreshToken,
    handleLogout,
    handleForgetPassword,
    handleResetPassword,
    loginGoogleAuth,
    // verifyOtp,
  }