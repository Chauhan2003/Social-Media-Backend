import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required!"],
    },
    email: {
      type: String,
      required: [true, "Email is required!"],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required!"],
      minlength: [6, "Password length should be greater than 6 characters"],
      select: true,
    },
    profileImage: {
      type: String,
    },
    coverImage: {
      type: String,
      default:
        "https://www.detroitevictiondefense.net/wp-content/themes/miyazaki/assets/images/default-fallback-image.png",
    },
    about: {
      type: String,
      maxlength: 255,
      default: "",
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
