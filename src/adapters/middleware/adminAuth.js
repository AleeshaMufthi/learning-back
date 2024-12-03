import AppError from "../../framework/web/utils/appError.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import { createAccessToken } from "../../framework/web/utils/generateTokens.js";

const isAuthAdmin = async (req, res, next) => {

    const accessToken = req.cookies["accessTokenAdmin"];
    const refreshToken = req.cookies["refreshTokenAdmin"]

    if (!accessToken) {
      return res.status(400).json({ err: "token is missing" });
    }
    try{
    const response = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
    if (response.user.role !== "admin") {
      return res.status(403).json({ messsage: "Not Authorized" });
    } 
    req.admin = response.user;
    next();
    }catch(err){
      if (err.name === "TokenExpiredError") {
        if (!refreshToken) {
          return res.status(401).json({
            err: "Refresh token is missing",
            name: "TokenMissingError",
          });
    }
    try{
      const refreshResponse = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      const newAccessToken = createAccessToken(refreshResponse.user);
      attachTokenToCookie("accessTokenAdmin", newAccessToken, res);
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