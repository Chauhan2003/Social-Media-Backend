import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is Required!"],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    about: {
      type: String,
      maxlength: 255,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
