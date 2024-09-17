import AppError from "../../framework/web/utils/appError.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";

const isAuthTutor = async (req, res, next) => {
    console.log("\n tutor isAuth Middleware accessed");
    const accessToken = req.cookies["accessTokenTutor"];
    const refreshToken = req.cookies["refreshTokenTutor"];
    if (!accessToken && !refreshToken)
      return res.status(400).json({ err: "token is missing" });
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
      .then((response) => {
        if (response.user.role !== "tutor") {
          console.log("role is not a tutor");
          return res.status(403).json({ messsage: "Not Authorized" });
        } else {
          req.tutor = response.user;
          next();
        }
      })
      .catch((err) => {
        console.error("token error");
        if (err?.name == "TokenExpiredError") console.log("token expired");
        else console.log(err);
        return res.status(403).json({ messsage: "Not Authorized" });
        throw AppError.authentication(err?.message);
      });
  };

  export default isAuthTutor