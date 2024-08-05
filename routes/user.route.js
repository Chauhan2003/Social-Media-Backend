import express from "express";
import { verifyEmail } from "../controllers/user.controller.js";
const router = express.Router();

router.route("/verify/:token").put(verifyEmail);

export default router;
