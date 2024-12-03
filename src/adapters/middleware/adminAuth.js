import AppError from "../../framework/web/utils/appError.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import { createAccessToken, createRefreshToken } from "../../framework/web/utils/generateTokens.js";

const isAuthAdmin = async (req, res, next) => {

    const accessToken = req.cookies["accessTokenAdmin"];
    const refreshToken = req.cookies["refreshTokenAdmin"]

    if (!refreshToken){
      return res.status(400).json({ err: "Token is missing",  name: "TokenMissingError" });
    }

    try{
    const response = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    console.log(response, "response");

    if (response.user.role !== "admin") {
      return res.status(403).json({ messsage: "Not Authorized" });
    } 

    req.admin = response.user;
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
      const refreshResponse = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      console.log(refreshResponse, 'refresh response');

      const newAccessToken = createRefreshToken(refreshResponse.user);
      console.log(newAccessToken, "new Access token");

      attachTokenToCookie("accessTokenAdmin", newAccessToken, res);
      console.log(refreshResponse, 'refresh response');
      
      req.admin = refreshResponse.user;
      next();
    }catch(refreshErr){
      return res.status(403).json({ err: "Refresh token is invalid or expired" });
    }
  } else {
    return res.status(401).json({ err });
  }
}
};

  export default isAuthAdmin