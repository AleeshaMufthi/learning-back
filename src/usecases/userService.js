import { createOtp, updateOtp, findOtpByEmail } from '../adapters/repository/commonRepo.js'
import {createUser, findUserByEmail, findUserByPhone, findUserByUserName, getAllUser, blockUserById, unblockUserById, findUserById, updateDetailsById, updatePassword, checkIsBlocked, googleAuthUser, getEnrolledCountById, findUserByCourseId, findUserByUserId, ChangePasswordUpdate } from '../adapters/repository/userRepo.js'
import emailOtp from '../framework/config/emailConnect.js'
import AppError from '../framework/web/utils/appError.js'
import { comparePasswords, createHashPassword } from '../framework/web/utils/bcrypt.js'
import generateOtp from '../framework/web/utils/generateOtp.js'
import verifyToken from '../framework/web/utils/verifyToken.js'
import { createAccessToken, createRefreshToken } from '../framework/web/utils/generateTokens.js'
import uploadImage from './cloudinaryImgService.js'
import { v2 as cloudinary } from "cloudinary";

export const handleSignIn = async({ email, password }) => {
  let user = await findUserByEmail(email);
  if (!user) throw AppError.validation("Email not registered");

  const isPasswordMatch = await comparePasswords(password, user.password);
  if (!isPasswordMatch) throw AppError.validation("Invalid Password");

  const isBlocked = await checkIsBlocked(email);
  if (isBlocked) throw AppError.forbidden("Access denied");

  const { password: _, ...userWithoutPassword } = user.toObject();

  const accessToken = createAccessToken(userWithoutPassword);
  const refreshToken = createRefreshToken(userWithoutPassword);

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
}

export const handleSignUp = async ({ name, password, email, phone, otp }) => { 
  try{
    const isEmailOtp = await findOtpByEmail(email);
    if (!isEmailOtp) {
      throw AppError.conflict("Try Again Otp TimeOut");
    }
    if (isEmailOtp.otp != otp) {
      throw AppError.conflict("Otp is Not Correct Try Again");
    }
    const isEmailTaken = await findUserByEmail(email);
    if (isEmailTaken) {
      throw AppError.conflict("Email is already taken");
    }
    const isPhoneTaken = await findUserByPhone(phone);
    if (isPhoneTaken) { 
      throw AppError.conflict("Phone Number is already taken");
    }
    const hashedPassword = await createHashPassword(password);
    let username = email.split("@")[0];
    const isUsernameUnique = await findUserByUserName(username);
  
    // Check if the username is already unique
    if (isUsernameUnique) {
      // If the username is not unique, add a numeric suffix to make it unique
      let suffix = 1;
      username = username + suffix;
      while (await findUserByUserName(username)) {
        suffix++;
        username = username + suffix;
      }
    }
    const user = await createUser({
      name,
      password: hashedPassword,
      phone,
      email,
      username,
    });
    return user;
  }catch(error){
    console.error("Error handling sign-up", error);
    throw error;
  }
}


export const handleSignUpOtp = async({ email, phone }) => {
try{
  const isEmailTaken = await findUserByEmail(email);
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await findUserByPhone(phone);
  if (isPhoneTaken) {
    throw AppError.conflict("Phone Number is already taken");
  }
  const otp = generateOtp(6);
  console.log('Generated OTP: ',otp)
  const isEmailOtp = await findOtpByEmail(email);
  if (isEmailOtp) {
    if (isEmailOtp.count >= 6) {
      throw AppError.conflict("Done maximum otp on this Number");
    }
    isEmailOtp.otp = otp; 
    isEmailOtp.count += 1
    await isEmailOtp.save()
  } else {
    await createOtp({ phone, email, otp })
  }
  await emailOtp(email, otp)
  return { message: "OTP sent successfully" };
}catch(error){
  console.error("Error handling sign-up OTP", error);
  throw error;
}
}

export const forgetPassword = async (email) => {
  // Check if user exists
  const user = await findUserByEmail(email);
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


export const changePassword = async (userId, currentPassword, newPassword) => {
  // Fetch the user by ID
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  // Compare current password
  console.log(currentPassword, 'current password');
  console.log(user.password, '');
  
  
  const isPasswordMatch = await comparePasswords(currentPassword, user.password);
  console.log(isPasswordMatch, '-----------------------------------');
  
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
  }
  // Hash the new password
  const hashedPassword = await createHashPassword(newPassword);
  // Update the user's password
  const updatedUser = await ChangePasswordUpdate(userId, hashedPassword);
  if (!updatedUser) {
    throw new Error("Failed to update password");
  }
};


export const getUserById = async(userId) => {
  return await findUserByUserId(userId)
}


export const getUserFromToken = async (accessToken) => {
  try{
    const decoded = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    return await findUserByEmail(decoded.email);
  }
    catch(err) {
      return false;
    }
  }

export const getAccessTokenByRefreshToken = async (refreshToken) => {
  try {
    const decoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await findUserByUserId(decoded.userId);
    if (!user) {
      throw AppError.authentication("Invalid refresh token! Please login again");
    }
    const accessToken = createAccessToken(user)
    return { user, accessToken }
  } catch (err) {
    throw AppError.authentication(err.message);
  }
};

export const getAllUsers = async (query) => {
  const {users, total} = await getAllUser(query);
  return {users, total};
};

export const blockUser = async (userId) => {
  const isBlocked = await blockUserById(userId);
  return isBlocked;
};

export const unblockUser = async (userId) => {
  const isBlocked = await unblockUserById(userId);
  return isBlocked;
};

export const getUserDetails = async (userId) => {
  let userDetails = await findUserById(userId);
  if(userDetails){
    userDetails = userDetails.toObject();
  
    userDetails.thumbnail = cloudinary.url(userDetails.thumbnail, {
      resource_type: "image", 
      secure: true, 
    });   
  }
  if (!userDetails) {
    throw AppError.validation("User Details was not found in database");
  }
  return userDetails;
};

export const updateUserDetails = async ({ _id, thumbnail, ...fields }) => {
  const updateFields = { ...fields };

  // Handle image upload if the thumbnail is provided
  if (thumbnail) {
    try {
      const uploadedThumbnail = await uploadImage(thumbnail); // Upload the file to Cloudinary or any other service

      if (!uploadedThumbnail) {
        throw AppError.database("Error while uploading media file");
      }

      updateFields.thumbnail = uploadedThumbnail.url; // Assign the uploaded URL to the update fields
    } catch (error) {
      throw AppError.database("Error during image upload: " + error.message);
    }
  }

  // Update the user details in the database
  const updatedUserDetails = await updateDetailsById({
    id: _id,
    updateFields,
  });

  if (!updatedUserDetails) {
    throw AppError.database("Error while updating user details");
  }

  return updatedUserDetails;
};


export const googleAuthValidate = async( email, userInfo ) => {
  return await googleAuthUser(email, userInfo)
}

export const getEnrolledStudentsCount = async (courseId) => {
  const enrolledStudentsCount = await getEnrolledCountById(
    courseId
  );
  return enrolledStudentsCount;
};

export const isEnrolledForCourse = async ({ courseId, userId }) => {
  const userData = await findUserByCourseId({
    courseId,
    userId,
  });
  
  if (userData) {
    return true;
  }
  return false;
};

  export default {
    handleSignIn,
    handleSignUp,
    handleSignUpOtp,
    getUserFromToken,
    getAccessTokenByRefreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
    getAllUsers,
    blockUser,
    unblockUser,
    getUserDetails,
    updateUserDetails,
    googleAuthValidate,
    getEnrolledStudentsCount,
    isEnrolledForCourse,
    // verifyOtp,
  }
