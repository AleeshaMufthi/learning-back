import jwt from 'jsonwebtoken'

const createAccessToken = (user, tutorBool = false, adminBool = false) => {
user.role = tutorBool ? "tutor" : adminBool ? "admin" : "user";
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  };
  const createRefreshToken = (user) => {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
  };

export {
    createAccessToken,
    createRefreshToken  
}