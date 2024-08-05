import express from "express";
import { handleRegister } from "../controllers/auth.controller.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

router.route("/register").post(upload.single("profileImage"), handleRegister);
// router.route("/login").post(handleLogin);
// router.route("/logout").get(handleLogout);
// router.route("/forget-password").post(handleForgetPassword);

export default router;
