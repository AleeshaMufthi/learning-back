import { findOtpByEmail, createOtp, updateOtp } from '../adapters/repository/commonRepo.js'
import adminRepository from '../adapters/repository/adminRepo.js'
import AppError from '../framework/web/utils/appError.js'
import verifyToken from '../framework/web/utils/verifyToken.js'
import { comparePasswords, createHashPassword } from '../framework/web/utils/bcrypt.js'
import generateOtp from '../framework/web/utils/generateOtp.js'
import { createAccessToken, createRefreshToken } from '../framework/web/utils/generateTokens.js'

export const handleSignIn = async ({ email, password }) => {

    let admin = await adminRepository.findAdminByEmail(email);
    console.log(admin,"Adminnn daaataaaa");
    
    if (!admin) throw AppError.validation("Email not registered");
  
    const isPasswordMatch = await comparePasswords(password, admin.password);
    if (!isPasswordMatch) throw AppError.validation("Invalid Password");
  
    const isBlocked = await adminRepository.checkIsBlocked(email);
    if (isBlocked) throw AppError.forbidden("Access denied");
  
    const { password: _, ...adminWithoutPassword } = admin.toObject();
  
    const accessToken = createAccessToken(
      adminWithoutPassword,
      false,  // tutorBool assign to false
      true    // adminBool assign to true
    );
    const refreshToken = createRefreshToken(adminWithoutPassword);
    return {
      adminData: adminWithoutPassword,
      accessToken,
      refreshToken,
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
    const isEmailTaken = await adminRepository.findAdminByEmail(email);
    if (isEmailTaken) {
      throw AppError.conflict("Email is already taken");
    }
    const isPhoneTaken = await adminRepository.findAdminByPhone(phone);
    if (isPhoneTaken) {
      throw AppError.conflict("Phone Number is already taken");
    }
    const hashedPassword = await createHashPassword(password);
    let adminname = email.split("@")[0];
    const isAdminnameUnique = await adminRepository.findAdminByAdminname(
      adminname
    );
  
    // Check if the adminname is already unique
    if (isAdminnameUnique) {
      // If the adminname is not unique, add a numeric suffix to make it unique
      let suffix = 1;
      adminname = adminname + suffix;
      while (await adminRepository.findAdminByAdminname(adminname)) {
        suffix++;
        adminname = adminname + suffix;
      }
    }
    const admin = await adminRepository.createAdmin({
      name,
      password: hashedPassword,
      phone,
      email,
      adminname,
    });
    return admin;
  };

export const handleSignUpOtp = async ({ email, phone }) => {
    const isEmailTaken = await adminRepository.findAdminByEmail(email);
    if (isEmailTaken) {
      throw AppError.conflict("Email is already taken");
    }
    const isPhoneTaken = await adminRepository.findAdminByPhone(phone);
    if (isPhoneTaken) {
      throw AppError.conflict("Phone Number is already taken");
    }
    const isPhoneOtp = await findOtpByEmail(email);
    let count = 0;
    let otp = generateOtp(6);
    console.log(otp,'Generated otp');
    
    if (isPhoneOtp) {
      if (isPhoneOtp.count > 6) {
        throw AppError.conflict("Done maximum otp on this Number");
      }
      isPhoneOtp.otp = otp;
      isPhoneOtp.count += 1;
      const admin = await updateOtp({
        isPhoneOtp,
      });
      return admin;
    } else {
      const admin = await createOtp({
        phone,
        email,
        otp,
      });
      return admin;
    }
  };
  
export const getAdminFromToken = async (accessTokenAdmin) => {
    return verifyToken(accessTokenAdmin, process.env.ACCESS_TOKEN_SECRET)
      .then(
        async (data) => await adminRepository.findAdminByEmail(data?.user.email)
      )
      .catch((err) => {
        console.log("error while decoding access token", err);
        return false;
      });
  };

export const getAccessTokenByRefreshToken = async (refreshTokenAdmin) => {
    const user = await adminRepository.findAdminByToken(refreshTokenAdmin);
    if (!user) {
      throw AppError.authentication("Invalid refresh token! please login again");
    }
  
    return verifyToken(refreshTokenAdmin, process.env.REFRESH_TOKEN_SECRET)
      .then((data) => {
        const accessTokenAdmin = createAccessToken(data);
        return accessTokenAdmin;
      })
      .catch((err) => {
        console.log("error verifying refresh token - ", err);
        throw AppError.authentication(err.message);
      });
  };

export const checkTokenAndDelete = async (token) => {
    const isTokenPresent = adminRepository.findByTokenAndDelete(token);
    return isTokenPresent;
  };

  export default {
    handleSignIn,
    handleSignUp,
    handleSignUpOtp,
    getAdminFromToken,
    getAccessTokenByRefreshToken,
    checkTokenAndDelete,
  }