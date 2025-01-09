import verifyToken from "../../framework/web/utils/verifyToken.js";
import { createAccessToken } from "../../framework/web/utils/generateTokens.js";
import attachTokenToCookie from "../../framework/web/utils/cookie.js";

const rbacAuth = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const accessToken = req.cookies["accessToken"];
      const refreshToken = req.cookies["refreshToken"];

      if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: "Unauthorized: No tokens provided" });
      }

      // Verify access token
      try {
        const { user } = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(user.role)) {
          return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
        }

        req.user = user; // Attach user data to the request
        return next();
      } catch (err) {
        if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
          // Attempt to refresh the token if access token is invalid
          if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized: Refresh token is missing or invalid" });
          }

          try {
            const { user } = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Generate a new access token
            const newAccessToken = createAccessToken(user);
            attachTokenToCookie("accessToken", newAccessToken, res);

            // Check if the user's role is in the allowed roles
            if (!allowedRoles.includes(user.role)) {
              return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
            }

            req.user = user; // Attach user data to the request
            return next();
          } catch (refreshErr) {
            return res.status(401).json({ message: "Unauthorized: Refresh token expired or invalid" });
          }
        } else {
          return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
      }
    } catch (error) {
      console.error("Authorization error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

export default rbacAuth;