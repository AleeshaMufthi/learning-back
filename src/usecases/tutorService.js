import {
  findOtpByEmail,
  createOtp,
  updateOtp,
} from "../adapters/repository/commonRepo.js";
import {
  findTutorByEmail,
  findTutorByPhone,
  findTutorById,
  findTutorByTutorName,
  findTutorByToken,
  updatePassword,
  createTutor,
  addRefreshTokenById,
  findByTokenAndDelete,
  getAllTutor,
  blockTutorById,
  unblockTutorById,
  updateDetailsById,
  getTutors,
} from "../adapters/repository/tutorRepo.js";
import AppError from "../framework/web/utils/appError.js";
import verifyToken from "../framework/web/utils/verifyToken.js";
import {
  comparePasswords,
  createHashPassword,
} from "../framework/web/utils/bcrypt.js";
import generateOtp from "../framework/web/utils/generateOtp.js";
import {
  createAccessToken,
  createRefreshToken,
} from "../framework/web/utils/generateTokens.js";
import emailOtp from "../framework/config/emailConnect.js";

export const handleSignIn = async ({ email, password }) => {
  let tutor = await findTutorByEmail(email);
  if (!tutor) throw AppError.validation("Email not registered");

  const isPasswordMatch = await comparePasswords(password, tutor.password);
  if (!isPasswordMatch) throw AppError.validation("Invalid Password");

  const { password: _, ...tutorWithoutPassword } = tutor.toObject();
  const accessTokenTutor = createAccessToken(tutorWithoutPassword, (tutorBool = true));
  const refreshTokenTutor = createRefreshToken(tutorWithoutPassword);

  return {
    tutorData: tutorWithoutPassword,
    accessTokenTutor,
    refreshTokenTutor,
  };
};

export const handleSignUp = async ({ name, password, phone, email, otp }) => {
  const isPhoneOtp = await findOtpByEmail(email);
  if (!isPhoneOtp) {
    throw AppError.conflict("Try Again Otp TimeOut");
  }
  if (isPhoneOtp.otp != otp) {
    throw AppError.conflict("Otp is Not Correct Try Again");
  }
  const isEmailTaken = await findTutorByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await findTutorByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const hashedPassword = await createHashPassword(password);
  let tutorname = email.split("@")[0];
  const isTutornameUnique = await findTutorByTutorName(tutorname);

  // Check if the tutorname is already unique
  if (isTutornameUnique) {
    // If the tutorname is not unique, add a numeric suffix to make it unique
    let suffix = 1;
    tutorname = tutorname + suffix;
    while (await findTutorByTutorName(tutorname)) {
      suffix++;
      tutorname = tutorname + suffix;
    }
  }
  const tutor = await createTutor({
    name,
    password: hashedPassword,
    phone,
    email,
    tutorname,
  });
  return tutor;
};

export const handleSignUpOtp = async ({ email, phone }) => {
  const isEmailTaken = await findTutorByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await findTutorByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  let otp = generateOtp(6);
  console.log(otp, "Generated OTP");

  const isEmailOtp = await findOtpByEmail(email);
  if (isEmailOtp) {
    if (isEmailOtp.count > 6) {
      throw AppError.conflict("Done maximum otp on this Number");
    }
    isEmailOtp.otp = otp;
    isEmailOtp.count += 1;
    await isEmailOtp.save();
  } else {
    await createOtp({ phone, email, otp });
  }
  await emailOtp(email, otp);
  return { message: "OTP sent successfully" };
};

export const forgetPassword = async (email) => {
  // Check if user exists
  const user = await findTutorByEmail(email);
  if (!user) {
    throw new Error("User not found for this email");
  }

  const otp = generateOtp(6);
  console.log("Generated OTP: ", otp);

  await emailOtp(email, otp);

  return user;
};

export const resetPassword = async (email, newPassword) => {
  try {
    const hashedPassword = await createHashPassword(newPassword);

    return await updatePassword(email, hashedPassword);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const getTutorFromToken = async (accessTokenTutor) => {
  try {
    const decoded = await verifyToken(
      accessTokenTutor,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log("Decoded token:", decoded);
    return await findTutorByEmail(decoded.user.email);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw AppError.authentication("TokenExpiredError");
    }
    if (err.name === "JsonWebTokenError") {
      throw AppError.authentication("Invalid token. Authentication failed.");
    }
    throw err;
  }
};

export const getAccessTokenByRefreshToken = async (refreshTokenTutor) => {
  const decoded = await verifyToken(
    refreshTokenTutor,
    process.env.REFRESH_TOKEN_SECRET
  );
  const tutor = decoded.user;

  if (!tutor) {
    throw AppError.authentication("Invalid refresh token! please login again");
  }
  const accessTokenTutor = createAccessToken(tutor);
  console.log(accessTokenTutor, "+======----0-0-983ejhcbbskmnxkkisjk");

  return accessTokenTutor;
};

export const checkTokenAndDelete = async (token) => {
  const isTokenPresent = findByTokenAndDelete(token);
  return isTokenPresent;
};

export const getAllTutors = async () => {
  const tutors = await getAllTutor();
  return tutors;
};

export const blockTutor = async (tutorId) => {
  const isBlocked = await blockTutorById(tutorId);
  return isBlocked;
};

export const unblockTutor = async (tutorId) => {
  const isBlocked = await unblockTutorById(tutorId);
  return isBlocked;
};

export const getTutorDetails = async (tutorId) => {
  const tutorDetails = await findTutorById(tutorId);
  if (!tutorDetails) {
    throw AppError.validation("Tutor Details was not found in database");
  }
  return tutorDetails;
};

export const updateTutorDetails = async (tutorDetails) => {
  const updatedTutorDetails = await updateDetailsById(tutorDetails);

  return updatedTutorDetails;
};

export const getTopTutors = async () => {
  const limit = 5;
  const topTutors = await getTutors(limit);
  return topTutors;
};

export default {
  handleSignIn,
  handleSignUp,
  handleSignUpOtp,
  forgetPassword,
  resetPassword,
  getTutorFromToken,
  getAccessTokenByRefreshToken,
  checkTokenAndDelete,
  getAllTutors,
  blockTutor,
  unblockTutor,
  getTutorDetails,
  updateTutorDetails,
  getTopTutors,
};
