import User from "../models/user.model.js";
import { verifyToken } from "../utils/TokenHandling.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  if (!token) {
    res.status(400).json({
      success: false,
      message: "Provide user",
    });
    return;
  }

  try {
    const decodedToken = await verifyToken(token);
    console.log(decodedToken);

    const updatedUser = await User.findByIdAndUpdate(
      decodedToken.userId,
      { verified: true },
      { new: true }
    );

    console.log(updatedUser);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Thank you, Email is verified",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
