import jwt from 'jsonwebtoken'

const verifyToken = (token, tokenSecret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, tokenSecret, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });
    }
    export default verifyToken