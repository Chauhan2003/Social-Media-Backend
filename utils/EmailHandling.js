import nodemailer from "nodemailer";
import { generateToken } from "./TokenHandling.js";
import dotenv from "dotenv";
dotenv.config();
import { formatDistanceToNow, addMinutes } from "date-fns";

const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASSWORD,
  },
});

export const sendVerificationEmail = async (user) => {
  const { _id, email, fullName } = user;
  const token = await generateToken({
    userId: _id,
  });
  const link = `${APP_URL}/verify/${token}`;
  const expirationTime = formatDistanceToNow(addMinutes(new Date(), 30), {
    addSuffix: true,
  });

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Email Verification",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0;">
          <h2>Email Verification</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
          <p>Dear ${fullName},</p>
          <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
          <a href="${link}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
          <p>If the button above doesn't work, please copy and paste the following URL into your web browser:</p>
          <p><a href="${link}" style="color: #4CAF50;">${link}</a></p>
          <p>This link will expire ${expirationTime}.</p>
          <p>Best regards,<br>Socail Media</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendPasswordResetEmail = async (user) => {
  const { _id, email, fullName } = user;
  const token = await generateToken(
    {
      userId: _id,
    },
    "15m"
  );
  const link = `${APP_URL}/reset-password/${token}`;
  const expirationTime = formatDistanceToNow(addMinutes(new Date(), 15), {
    addSuffix: true,
  });

  const mailOptions = {
    from: AUTH_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto;">
        <div style="background-color: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px 5px 0 0;">
          <h2>Password Reset</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 5px 5px;">
          <p>Dear ${fullName},</p>
          <p>You have requested to reset your password. Please click the button below to reset your password:</p>
          <a href="${link}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
          <p>If the button above doesn't work, please copy and paste the following URL into your web browser:</p>
          <p><a href="${link}" style="color: #4CAF50;">${link}</a></p>
          <p>This link will expire ${expirationTime}.</p>
          <p>Best regards,<br>Social Media</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
