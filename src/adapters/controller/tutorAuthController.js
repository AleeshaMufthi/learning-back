import AppError from "../../framework/web/utils/appError.js";
import asyncHandler from "express-async-handler";
import {
  signInSchema,
  signUpSchema,
  signUpSchemaWithOtp,
} from "../../entities/authValidator.js";
import tutorService from "../../usecases/tutorService.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import passwordSchema from "../../entities/passwordValidator.js";

export const handleSignIn = asyncHandler(async (req, res) => {
  const { error, value } = signInSchema.validate(req.body);
  if (error) {
    console.log(error);
    return res.status(400).json({ message: error.details[0].message });
  }
  const { tutorData, accessTokenTutor, refreshTokenTutor } =
    await tutorService.handleSignIn(value);
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
      userId: user._id, // You might use this to track user in session
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const handleResetPassword = async (req, res) => {
  try {

    // Extract validated values
    const { email, password } = req.body;

    await tutorService.resetPassword(email, password);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ error: error.message });
  }
};

export const restoreUserDetails = asyncHandler(async (req, res) => {
  try {
    const tutorData = req.tutor;

    if (!tutorData) {
      res.clearCookie("accessTokenTutor");
      res.clearCookie("refreshTokenTutor");
      return res
        .status(200)
        .json({ message: "Invalid token", tutorData });
    }

    return res.status(200).json({
      message: "Tutor details found",
      tutorData,
    });
  } catch (err) {
    if (err.message === "TokenExpiredError") {
      try {
        // Attempt to refresh token on access token expiry
        const refreshToken = req.cookies["refreshTokenTutor"];
        const newAccessToken = await tutorService.getAccessTokenByRefreshToken(
          refreshToken
        );
        attachTokenToCookie("accessTokenTutor", newAccessToken, res);

        // const tutorData = await tutorService.getTutorFromToken(newAccessToken);
        // console.log(tutorData, 'tutordataa');

        return res.status(200).json({ message: "Updated Access Token" });
      } catch (refreshErr) {
        console.error("Refresh token error:", refreshErr);
        res.clearCookie("accessTokenTutor");
        res.clearCookie("refreshTokenTutor");
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." });
      }
    }

    console.error("Error restoring user details:", err);
    res.clearCookie("accessTokenTutor");
    res.clearCookie("refreshTokenTutor");
    return res.status(401).json({ message: "Authentication failed" });
  }
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
};
