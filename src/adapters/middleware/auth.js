import { createAccessToken } from "../../framework/web/utils/generateTokens.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";

const isAuth = async (req, res, next) => {
    const accessToken = req.cookies["accessToken"];
    const refreshToken = req.cookies["refreshToken"];
  
    if (!accessToken)
      return res
        .status(401)
        .json({ err: "Token is missing", name: "TokenMissingError" });
  
    try {
      const response = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
      // Remove role-specific check
      console.log("token verified", response.user.name);
      req.user = response.user;
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        // Access token is expired, try to verify the refresh token
        if (!refreshToken) {
          return res
            .status(401)
            .json({ err: "Refresh token is missing", name: "TokenMissingError" });
        }
  
        try {
          const refreshResponse = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
         
          const newAccessToken = createAccessToken(refreshResponse.user);
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });
          console.log("New access token generated", refreshResponse.user.name);
          req.user = refreshResponse.user;
          next();
        } catch (refreshErr) {
          return res.status(403).json({ err: "Refresh token is invalid or expired" });
        }
      } else {
        console.log(err);
        return res.status(401).json({ err });
      }
    }
  };
  
  export default isAuth;