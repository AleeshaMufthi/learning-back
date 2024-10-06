import AppError from "../../framework/web/utils/appError.js";
import verifyToken from "../../framework/web/utils/verifyToken.js";

const isAuthAdmin = async (req, res, next) => {
    console.log("admin isAuth Middleware accessed");
    const accessToken = req.cookies["accessTokenAdmin"];
    if (!accessToken) return res.status(400).json({ err: "token is missing" });
    verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET)
      .then((response) => {
        if (response.user.role !== "admin") {
          console.log("Role is not an admin");
          return res.status(403).json({ messsage: "Not Authorized" });
        } else {
          req.admin = response.user;
          next();
        }
      })
      .catch((err) => {
        console.error("token error");
        if (err?.name == "TokenExpiredError") console.log("token expired");
        else console.log(err);
        throw AppError.authentication(err?.message)
      });
  };

  export default isAuthAdmin