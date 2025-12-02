// utils/sendOtp.js
const nodemailer = require("nodemailer");

async function sendOtp({ toEmail, otp, purpose }) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      purpose === "register"
        ? "Your Registration OTP"
        : "Your Password Reset OTP";

    const htmlTemplate = `
      <div style="font-family:Arial; padding:20px;">
        <h2>Your OTP Code</h2>
        <p style="font-size:18px">Your OTP is: 
          <strong style="font-size:22px; color:#2196F3;">${otp}</strong>
        </p>
        <p>Use this code to complete your ${purpose} process.</p>
        <p style="color:gray; font-size:14px;">This OTP will expire in 10 minutes.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: toEmail,
      subject,
      html: htmlTemplate,
    });

    console.log("OTP email sent successfully");
    return true;
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    return false;
  }
}

module.exports = sendOtp;
