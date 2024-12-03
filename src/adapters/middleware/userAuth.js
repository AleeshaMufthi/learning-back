import verifyToken from "../../framework/web/utils/verifyToken.js";
import { createAccessToken } from "../../framework/web/utils/generateTokens.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";
import AppError from "../../framework/web/utils/appError.js";

const isAuthUser = async (req, res, next) => {
  
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];

  if (!accessToken)
    return res
      .status(401)
      .json({ err: "Access Token is missing", name: "TokenMissingError" });

  try {
    const decoded = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log(decoded,'********************************************************');
    
    if (decoded.user.role !== "user") {
      return res.status(403).json({ message: "Not Authorized" });
    }
    console.log("token verified", response.user.name);
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      if (!refreshToken) {
        return res
          .status(401)
          .json({ err: "Refresh token is missing", name: "TokenMissingError" });
      }

      try {
        const refreshDecoded = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (refreshDecoded.user.role !== "user") {
          return res.status(403).json({ message: "Not Authorized" });
        }
        const newAccessToken = createAccessToken(refreshDecoded.user);
        attachTokenToCookie("accessToken", newAccessToken, res)
        req.user = refreshDecoded.user;
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