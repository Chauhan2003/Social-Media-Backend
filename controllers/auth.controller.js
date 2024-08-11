import User from "../models/user.model.js";
import { compareHash, hashString } from "../utils/BcryptHandling.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { sendVerificationEmail } from "../utils/EmailHandling.js";
import { generateToken } from "../utils/TokenHandling.js";

export const handleRegister = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const profileImage = req.file;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await hashString(password);

    let profileImageUrl = "";
    if (profileImage) {
      profileImageUrl = await uploadOnCloudinary(profileImage.path);
    } else {
      profileImageUrl =
        "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg";
    }

    const createdUser = new User({
      profileImage: profileImageUrl,
      fullName,
      email,
      password: hashedPassword,
    });

    try {
      await sendVerificationEmail(createdUser);
      await createdUser.save();

      res.status(201).json({
        success: true,
        message: "Verification your email address",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Registration failed",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await compareHash(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(
      {
        fullName: existingUser.fullName,
        email: existingUser.email,
        profileImage: existingUser.profileImage,
      },
      "2d"
    );

    res.cookie("social-media-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    const user = {
      _id: existingUser._id,
      fullName: existingUser.fullName,
      email: existingUser.email,
      profileImage: existingUser.profileImage,
    };

    res.status(200).json({
      success: true,
      message: "User login successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const handleLogout = (req, res, next) => {
  res.clearCookie("social-media-token");
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};
