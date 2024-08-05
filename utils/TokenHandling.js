import jwt from "jsonwebtoken";

export const generateToken = async (payload, expiresIn = "1h") => {
  try {
    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: expiresIn },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
};

export const verifyToken = async (token) => {
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
  }
};
