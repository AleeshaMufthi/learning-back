import jwt from 'jsonwebtoken'

export const createAccessToken = (user, tutorBool = false, adminBool = false) => {
    user.role = tutorBool ? "tutor" : adminBool ? "admin" : "user";
    return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
  };
export const createRefreshToken = (user) => {
    return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
  };
