import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

async function generateToken(payload, expiresIn = "1h") {
  try {
    const token = await new Promise((resolve, reject) => {
      jwt.sign(payload, secretKey, { expiresIn: expiresIn }, (err, token) => {
        if (err) {
          e;
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
  }
}

export default generateToken;
