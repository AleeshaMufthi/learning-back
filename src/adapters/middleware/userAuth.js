import verifyToken from "../../framework/web/utils/verifyToken.js";
import { createAccessToken, createRefreshToken } from "../../framework/web/utils/generateTokens.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import AppError from "../../framework/web/utils/appError.js";

const isAuthUser = async (req, res, next) => {
  
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken){
    return res.status(400).json({ err: "Token is missing",  name: "TokenMissingError" });
  }

  try {
    const response = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    
    if (response.user.role !== "user") {
      return res.status(403).json({ message: "Not Authorized" });
    }
    req.user = response.user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      if (!refreshToken) {
        return res
          .status(401)
          .json({ err: "Refresh token is missing", name: "TokenMissingError" });
      }

      try {
        const refreshResponse = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = createRefreshToken(refreshResponse.user);
        attachTokenToCookie("accessToken", newAccessToken, res)
        
        req.user = refreshResponse.user;
        next();
      } catch (refreshErr) {
        return res.status(403).json({ err: "Refresh token is invalid or expired"});
      }
    } else {
      console.log(err);
      return res.status(401).json({ err: err.message, name: err.name });
    }
  }
};

export default isAuthUser;