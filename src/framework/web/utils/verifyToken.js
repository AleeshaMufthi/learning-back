import jwt from 'jsonwebtoken'

const verifyToken = (token, tokenSecret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return reject({ name: 'TokenExpiredError', message: 'Token has expired' });
        }
        if (err.name === "JsonWebTokenError") {
          return reject({ name: 'JsonWebTokenError', message: 'Token is invalid' });
        }
      }
      resolve(decoded);
        });
      });
    }
    export default verifyToken