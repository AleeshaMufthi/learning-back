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

  // export const verifyOtp = async (req, res) => {
  //   const { otp, email } = req.body;
  //   console.log("Received OTP:", otp);
  //   console.log("Received Email:", email);
  //   try {
  //     // Call a service function to verify the OTP
  //     const isValid = await userService.verifyOtp(email, otp);
  
  //     if (isValid) {
  //       res.status(200).json({ message: "OTP verified successfully." });
  //     } else {
  //       res.status(400).json({ message: "Invalid OTP." });
  //     }
  //   } catch (err) {
  //     res.status(500).json({ message: "An error occurred during OTP verification." });
  //   }
  // };

  export const handleResetPassword = async (req, res) => {
    try {
      console.log(req.body, 'body');
      
      // Extract validated values
      const { email, password } = req.body

      await userService.resetPassword(email, password);
      console.log(email,'emaillll vannoo');
      
      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error.message);
      res.status(400).json({ error: error.message });
    }
  };

export const restoreUserDetails = asyncHandler(async (req, res) => { 
    if (!req.cookies["refreshToken"]) {
      return res
        .status(200)
        .json({ message: "refresh token not found", userData: null });
    }
    const userData = await userService.getUserFromToken(
      req.cookies["accessToken"]
    );
    if (!userData) {
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
    }
    return res.status(200).json({
      message: userData ? "user details found" : "user not found",
      userData,
    });
  });


  export const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    try{
      const accessToken = await userService.getAccessTokenByRefreshToken(
        refreshToken
      );
      attachTokenToCookie("accessToken", accessToken, res);
    
      res.status(200).json({ accessToken, message: "token created successfully" });
    }catch(error){
    console.error("Error refreshing token:", error);
    return res.status(401).json({ message: error.message });
    }
  });

  export const handleLogout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) console.log("refresh token not present in request");
  
    //delete refresh token from database
    const isTokenPresent = await userService.checkTokenAndDelete(refreshToken);
    if (!isTokenPresent) console.log("token not present in database");
  
    // clear cookie from response
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
    console.log(data,'google auth data');

    if (data) {
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