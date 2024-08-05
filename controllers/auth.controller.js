import User from "../models/user.model.js";
import { compareHash, hashString } from "../utils/BcryptHandling.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import generateToken from "../utils/TokenHandling.js";

export const handleRegister = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const profileImage = req.file;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
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
    await createdUser.save();

    const { password: _, ...user } = createdUser.toObject();
    res.status(201).json({
      message: "User registered successfully.",
      user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const handleLogin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await compareHash(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = generateToken(
      {
        fullName: existingUser.fullName,
        email: existingUser.email,
        profileImage: existingUser.profileImage,
      },
      "4d"
    );

    res.cookie("social-media-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 4 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...user } = existingUser.toObject();
    res.status(200).json({
      user,
      message: "User login successfully.",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error!" });
  }
};

export const handleLogout = (req, res, next) => {
  res.clearCookie("social-media-token");
  res.status(200).json({ message: "User logged out successfully." });
};
