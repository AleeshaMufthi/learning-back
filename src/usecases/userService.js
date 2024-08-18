import {  findOtpByEmail, createOtp, updateOtp, verifyOtp } from '../adapters/repository/commonRepo.js'
import {createUser, findUserByEmail, findByUserName, findUserByToken, addRefreshTokenById } from '../adapters/repository/userRepo.js'
import emailOtp from '../framework/config/emailConnect.js'
import AppError from '../framework/web/utils/appError.js'
import { comparePasswords, createHashPassword } from '../framework/web/utils/bcrypt.js'
import generateOtp from '../framework/web/utils/generateOtp.js'
import verifyToken from '../framework/web/utils/verifyToken.js'
import { createAccessToken, createRefreshToken } from '../framework/web/utils/generateToken.js'
import userModel from '../adapters/model/userModel.js'

let userdata={
  name: "",
  email:"",
  password:"",
}


const handleSignIn = async({ email, password }) => {

    let user = await findUserByEmail(email)

    console.log(user,'user');

    if(!user) 
        throw  AppError.validation("Email  not registered")

    const isPasswordMatch = await comparePasswords(password, user.password)
    if(!isPasswordMatch)
        throw  AppError.validation("Invalid Password")

    const { password:_, ...userWithoutPassword } = user.toObject()

    const accessToken = createAccessToken(userWithoutPassword);
    const refreshToken = createRefreshToken(userWithoutPassword);

    await addRefreshTokenById(user._id, refreshToken);

    return {
        user: userWithoutPassword,
        accessToken,
        refreshToken,
    }
}

const handleSignUp = async ( {name, password, email} ) => {
    
    const isEmailTaken = await findUserByEmail(email)
    if (isEmailTaken) {
      throw AppError.conflict("Email is already taken");
    }
    const hashedPasssword = await createHashPassword(password)

    userdata={
      name ,
      email,
      password: hashedPasssword,
    }
  
    let otp = generateOtp(4)
    console.log('Generated Otp:',otp)

    const newOtpEntry = await createOtp(
      email,
      otp,
    )

    await emailOtp(email, otp) 
    return newOtpEntry;
}


const handleSignUpOtp = async({ otp, email }) => {

  const isValidOtp = await verifyOtp(email, otp);

  if(isValidOtp){
    const userData = await findUserByEmail(email)

  const newUser = new userModel({
    name: userdata.name,
    email: userdata.email,
    password: userdata.password,
  })

  await newUser.save()
  

  res.status(201).json({ message: 'User registered successfully'})
  
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
  // if (otp ||email) {
  //   const verificationResult = await verifyOtp(email, otp);
  //   if(verificationResult){ 

  //     const user = await createUser(userdata)

  //     return user
  //   }else{
  //     return 'invalid otp'
  //   }  

  // }
}

const resendOtp = async (email) => {
  try {
    const otp = generateOtp(4);
    console.log('Resended Otp:',otp)
    const otpGeneratedTime = Date.now();

    await emailOtp(email, otp);

    return { otp }; 

  } catch (error) {
    throw new AppError("Something went wrong", 500);
  }
};


const getUserFromToken = async (accessToken) => {
  return verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    .then(
      async (data) => await findUserByEmail(data?.user.email)
    )
    .catch((err) => {
      console.log("error while decoding access token", err);
      return false;
    });
};

const getAccessTokenByRefreshToken = async (refreshToken) => {
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


  export {
    handleSignIn,
    handleSignUp,
    handleSignUpOtp,
    resendOtp,
    getUserFromToken,
    getAccessTokenByRefreshToken
  }
