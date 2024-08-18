import {  signInSchema, signUpSchema, signUpSchemaWithOtp } from "../../entities/authValidator.js";
import asyncHandler from "express-async-handler";
import { handleSignIn, handleSignUp, handleSignUpOtp, resendOtp, getAccessTokenByRefreshToken, getUserFromToken} from '../../usecases/userService.js'
import AppError from "../../framework/web/utils/appError.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";

  /**
 * @desc user signIn
 * @route  POST /auth/signIn
 * @access public
 */

const handleLogIn = asyncHandler(async (req, res) => {
    const { error, value } = signInSchema.validate(req.body);
    if (error) {
      console.log(error);
      throw AppError.validation(error.details[0].message);
    }
    const { user, accessToken, refreshToken } = await handleSignIn(
      value
    );

    attachTokenToCookie("accessToken", accessToken, res);
    attachTokenToCookie("refreshToken", refreshToken, res);
    console.log("user login successful.user is ", user.name);
   
    res.status(200).json({ message: "Login successfull", user });
  })

  /**
 * @desc user signup
 * @route  POST /auth/signup
 * @access public
 */
const handleRegister = asyncHandler(async (req, res) => {

  const { error, value } = signUpSchema.validate(req.body);
  if (error) {
    throw AppError.validation(error.details[0].message);
  }
     
    const user = await handleSignUp(value);

    console.log(
      "New User has been registered -",
      value.name,
      "with email - ",
      value.email,
    );
   
    return res.status(200).json({ message: "Account created successfully" });
  });



  const handleSignOtp = asyncHandler(async (req, res) => {
    const {otp,email} = req.body
  
    const data = await handleSignUpOtp(otp,email);
    return res.status(200).json({ message: "Otp send successfully", success:true });
  })


  const otpResend = asyncHandler(async (req, res) => {

    const { email } = req.body;

    const result = await resendOtp(email);

    return res.status(200).json({
      status: "success",
      message: "OTP has been resent successfully",
      data: result,
    })
  })


  const restoreUserDetails = asyncHandler(async (req, res) => { 
    if (!req.cookies["refreshToken"]) {
      return res
        .status(200)
        .json({ message: "refresh token not found", userData: null });
    }
    const userData = await getUserFromToken(
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

  const refreshToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
      throw AppError.authentication("provide a refresh token");
    }
    const accessToken = await getAccessTokenByRefreshToken(
      refreshToken
    );
    attachTokenToCookie("accessToken", accessToken, res);
  
    res.status(200).json({ message: "token created successfully" });
  });

  export {
    handleLogIn,
    handleRegister,
    handleSignOtp,
    otpResend,
    restoreUserDetails,
    refreshToken
  }