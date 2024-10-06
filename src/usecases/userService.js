import { createOtp, updateOtp, findOtpByEmail } from '../adapters/repository/commonRepo.js'
import {createUser, findUserByEmail, findUserByPhone, findUserByUserName, findUserByToken, addRefreshTokenById, findByTokenAndDelete, getAllUser, blockUserById, unblockUserById, findUserById, updateDetailsById, updatePassword, checkIsBlocked, googleAuthUser } from '../adapters/repository/userRepo.js'
import emailOtp from '../framework/config/emailConnect.js'
import AppError from '../framework/web/utils/appError.js'
import { comparePasswords, createHashPassword } from '../framework/web/utils/bcrypt.js'
import generateOtp from '../framework/web/utils/generateOtp.js'
import verifyToken from '../framework/web/utils/verifyToken.js'
import { createAccessToken, createRefreshToken } from '../framework/web/utils/generateTokens.js'




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

  // commented until until database refresh token cleanUp is implemented
  await addRefreshTokenById(user._id, refreshToken);

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
      console.log('No OTP found for email:', email);
      throw AppError.conflict("Try Again Otp TimeOut");
    }
    if (isEmailOtp.otp != otp) {
      console.log('Incorrect OTP:', otp);
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
  console.log(isEmailTaken,'isEmailtaken'); 
  if (isEmailTaken) {
    throw AppError.conflict("Email is already taken");
  }
  const isPhoneTaken = await findUserByPhone(phone);
  console.log(isPhoneTaken,'isPhoneTaken'); 
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

// export const verifyOtp = async ({email, otp}) => {
//   try {
//     const isEmailOtp = await findOtpByEmail(email);

//     if (isEmailOtp && isEmailOtp.otp === Number(otp) ) {
     
//     return true;
//     }
//     return false;
//   } catch (err) {
//     throw new Error("Error verifying OTP.");
//   }
// };

export const resetPassword = async ( email, newPassword ) => {
  try {
    const hashedPassword = await createHashPassword(newPassword);

    return await updatePassword(email, hashedPassword);
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};


export const getUserFromToken = async (accessToken) => {
  return verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then(
      async (data) => await findUserByEmail(data?.user.email)
    )
    .catch((err) => {
      console.log("error while decoding access token", err);
      return false;
    });
};

export const getAccessTokenByRefreshToken = async (refreshToken) => {
  const user = await findUserByToken(refreshToken);
  if (!user) {
    throw AppError.authentication("Invalid refresh token! please login again");
  }
  return verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    .then((data) => {
      const accessToken = createAccessToken(data);
      return accessToken;
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

export const getAllUsers = async () => {
  const users = await getAllUser();
  return users;
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
  const userDetails = await findUserById(userId);
  if (!userDetails) {
    throw AppError.validation("User Details was not found in database");
  }
  return userDetails;
};

export const updateUserDetails = async (userDetails) => {
  const updatedUserDetails = await updateDetailsById(
    userDetails
  );
  return updatedUserDetails;
};

export const googleAuthValidate = async( email, userInfo ) => {
  return await googleAuthUser(email, userInfo)
}

  export default {
    handleSignIn,
    handleSignUp,
    handleSignUpOtp,
    getUserFromToken,
    getAccessTokenByRefreshToken,
    checkTokenAndDelete,
    forgetPassword,
    resetPassword,
    getAllUsers,
    blockUser,
    unblockUser,
    getUserDetails,
    updateUserDetails,
    googleAuthValidate,
    // verifyOtp,
  }
