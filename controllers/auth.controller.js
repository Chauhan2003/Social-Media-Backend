import User from "../models/user.model.js";
import { hashString } from "../utils/BcryptHandling.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

export const handleRegister = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res.status(400).json({ message: "Full name is required." });
  }
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required." });
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
