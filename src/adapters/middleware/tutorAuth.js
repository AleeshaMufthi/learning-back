import AppError from "../../framework/web/utils/appError.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";
import { createAccessToken, createRefreshToken } from "../../framework/web/utils/generateTokens.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";

const isAuthTutor = async (req, res, next) => {

    const accessToken = req.cookies["accessTokenTutor"];
    const refreshToken = req.cookies["refreshTokenTutor"];

    if (!refreshToken){
      return res.status(400).json({ err: "Token is missing",  name: "TokenMissingError" });
    }

    try{
      const response = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
      
      if (response.user.role !== "tutor") {
        return res.status(403).json({ messsage: "Not Authorized" });
      }
      
      req.tutor = response.user;
      next();   
    }catch(err){
      
      if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
        if (!refreshToken) {
          return res.status(401).json({
            err: "Refresh token is missing",
            name: "TokenMissingError",
          });
    }
    try{
      const refreshResponse = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      
      const newAccessToken = createRefreshToken(refreshResponse.user);
      
      attachTokenToCookie("accessTokenTutor", newAccessToken, res);
      
      req.tutor = refreshResponse.user;
      next();
    } catch (refreshErr) {
      return res.status(403).json({ err: "Refresh token is invalid or expired" });
    }
  } else {
    return res.status(401).json({ err });
  }
}
};

  export default isAuthTutor