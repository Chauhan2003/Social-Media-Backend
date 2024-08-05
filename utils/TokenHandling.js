import jwt from "jsonwebtoken";

async function generateToken(payload, expiresIn = "1h") {
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
}

export default generateToken;
