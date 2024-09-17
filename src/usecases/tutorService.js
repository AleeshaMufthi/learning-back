import { findOtpByEmail, createOtp, updateOtp } from "../adapters/repository/commonRepo.js";
import { findTutorByEmail, findTutorByPhone, findTutorById, findTutorByTutorName, findTutorByToken, updatePassword, createTutor, addRefreshTokenById, findByTokenAndDelete, getAllTutor, blockTutorById, unblockTutorById, updateDetailsById } from "../adapters/repository/tutorRepo.js";
import AppError from "../framework/web/utils/appError.js";
import verifyToken from "../framework/web/utils/verifyToken.js";
import { comparePasswords, createHashPassword } from "../framework/web/utils/bcrypt.js";
import generateOtp from "../framework/web/utils/generateOtp.js";
import { createAccessToken, createRefreshToken } from "../framework/web/utils/generateTokens.js";
import emailOtp from "../framework/config/emailConnect.js";


export const handleSignIn = async ({ email, password }) => {
    let tutor = await findTutorByEmail(email);
    if (!tutor) throw AppError.validation("Email not registered");
    const isPasswordMatch = await comparePasswords(password, tutor.password);
    if (!isPasswordMatch) throw AppError.validation("Invalid Password");
  
    const { password: _, ...tutorWithoutPassword } = tutor.toObject();
    const accessTokenTutor = createAccessToken(
      tutorWithoutPassword,true
      // tutorBool = true
    );
    const refreshTokenTutor = createRefreshToken(tutorWithoutPassword);
    await addRefreshTokenById(tutor._id, refreshTokenTutor);
  
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
    const isTutornameUnique = await findTutorByTutorName(
      tutorname
    );
  
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
    console.log(otp,'Generated OTP')

    const isEmailOtp = await findOtpByEmail(email)
    if (isEmailOtp) {
      if (isEmailOtp.count > 6) {
        throw AppError.conflict("Done maximum otp on this Number");
      }
      isEmailOtp.otp = otp;
      isEmailOtp.count += 1;
      await isEmailOtp.save()
    } else {   
     await createOtp({ phone, email, otp})
    }
    await emailOtp(email, otp)
    return {message: "OTP sent successfully"}
  };

  export const forgetPassword = async (email) => {
    // Check if user exists
    const user = await findTutorByEmail(email);
    if (!user) {
      throw new Error("User not found for this email");
    }
    
    const otp = generateOtp(6);
    console.log('Generated OTP: ',otp)
  
    await emailOtp(email, otp);
  
    return user;
  };
  
  export const resetPassword = async ( email, newPassword ) => {
    try {
      const hashedPassword = await createHashPassword(newPassword);
  
      return await updatePassword(email, hashedPassword);
    } catch (error) {
      console.error("Error resetting password:", error);
      throw error;
    }
  };

 export const getTutorFromToken = async (accessTokenTutor) => {
    return verifyToken(accessTokenTutor, process.env.ACCESS_TOKEN_SECRET)
      .then(
        async (data) => await findTutorByEmail(data?.user.email)
      )
      .catch((err) => {
        console.log("error while decoding access token", err);
        return false;
      });
  };

 export const getAccessTokenByRefreshToken = async (refreshTokenTutor) => {
    const tutor = await findTutorByToken(refreshTokenTutor);
    if (!tutor) {
      throw AppError.authentication("Invalid refresh token! please login again");
    }
  
    return verifyToken(refreshTokenTutor, process.env.REFRESH_TOKEN_SECRET)
      .then((data) => {
        const accessTokenTutor = createAccessToken(data);
        return accessTokenTutor;
      })
      .catch((err) => {
        console.log("error verifying refresh token - ", err);
        throw AppError.authentication(err.message);
      });
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
    const updatedTutorDetails = await updateDetailsById(
      tutorDetails
    );
  
    return updatedTutorDetails;
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
  }