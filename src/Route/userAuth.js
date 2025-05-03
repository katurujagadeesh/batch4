const express = require("express");
const { sendResponse } = require("../middleware/middleware");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  validate,
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require("../middleware/userAuthValidation");
const { generateTokens,verifyRefreshToken } = require("../utility/tokenUtil");
const { sendMail } = require("../utility/nodeMailer");
const { authenticateToken } = require("../middleware/authMiddlewarevalidation");
let users = [];
let refreshTokens = [];
let userOtps = [];

//registration
router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password, age } = req.body;

  const existing = users.find((u) => u.email === email);
  if (existing) return sendResponse(res, 400, "Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  //  console.log("hashedPassword",hashedPassword)
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    age,
  };

  users.push(newUser);
  const tokens = generateTokens(newUser);
  refreshTokens.push(tokens.refreshToken);

  return sendResponse(res, 201, "User registered", {
    user: { id: newUser.id, email },
    ...tokens,
  });
});

//login
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email);
  if (!user) return sendResponse(res, 401, "Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return sendResponse(res, 401, "Invalid credentials");

  const tokens = generateTokens(user);
  refreshTokens.push(tokens.refreshToken);

  return sendResponse(res, 200, "Login successful", {
    user: { id: user.id, email },
    ...tokens,
  });
});

router.post(
  "/sendEmailOtp",
  validate(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) return sendResponse(res, 404, "User not found");

    try {
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expireAt = Date.now() + 60 * 1000; // expires in 1 minute

      const existingOtpEntry = userOtps.find((entry) => entry.email === email);

      if (existingOtpEntry) {
        existingOtpEntry.otp = otp;
        existingOtpEntry.expireAt = expireAt;
      } else {
        userOtps.push({ email, otp, expireAt });
      }

      const message = `
            <p>Dear User,</p>
            <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
            <p>Please use it within 1 minute to verify your email and complete the password reset process.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <br />
            <p>Best regards,<br />Batch$ Team<br /><a href="https://example.com">https://example.com</a></p>
        `;

      // Mock or real email sending function
      await sendMail(email, "OTP Verification Code - Batch4", message);

      return sendResponse(res, 200, "OTP created. Please check your email.", {
        otp,
      });
    } catch (error) {
      return sendResponse(res, 500, error.message);
    }
  }
);
// Verify OTP
router.post("/verify-otp", validate(verifyOtpSchema), async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return sendResponse(res, 400, "Email and OTP are required");
  }

  const otpEntry = userOtps.find((entry) => entry.email === email);

  if (!otpEntry) {
    return sendResponse(res, 404, "OTP not found. Please request a new one.");
  }

  const isExpired = Date.now() > otpEntry.expireAt;

  if (isExpired) {
    // Optionally remove expired OTPs
    userOtps = userOtps.filter((entry) => entry.email !== email);
    return sendResponse(res, 410, "OTP has expired. Please request a new one.");
  }

  if (otpEntry.otp.toString() !== otp.toString()) {
    return sendResponse(res, 401, "Invalid OTP");
  }

  // OTP is valid – remove from store
  userOtps = userOtps.filter((entry) => entry.email !== email);

  return sendResponse(res, 200, "OTP verified successfully");
});
// Reset Password
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  async (req, res) => {
    const { email, newPassword } = req.body;

    const userIndex = users.findIndex((u) => u.email === email);
    if (userIndex === -1) {
      return sendResponse(res, 404, "User not found");
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      users[userIndex].password = hashedPassword;

      return sendResponse(res, 200, "Password reset successful");
    } catch (error) {
      return sendResponse(res, 500, "Failed to reset password");
    }
  }
);
// Protected route
router.get("/getUserDetail", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return sendResponse(res, 404, "User not found");

  return sendResponse(res, 200, "User data retrieved", {
    id: user.id,
    name: user.name,
    email: user.email,
    age: user.age,
  });
});

router.get("/getAllUsers", authenticateToken, (req, res) => {
  return sendResponse(res, 200, "get all users successfully", users);
});

router.put("/updateUser", authenticateToken, (req, res) => {
  const userIndex = users.findIndex((u) => u.id == req.user.id);
  if (userIndex == -1) {
    return sendResponse(res, 404, "user not found");
  }
  const { name, email, age } = req.body;
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (age) users[userIndex].age = age;

  return sendResponse(res, 200, "user update successfully", users[userIndex]);
});

// Refresh Token
router.post("/refresh-token", validate(refreshTokenSchema), (req, res) => {
  const { token } = req.body;

  if (!token || !refreshTokens.includes(token)) {
    return sendResponse(res, 403, "Refresh token not found or expired");
  }

  try {
    const user = verifyRefreshToken(token);
    const accessToken = generateTokens(user).accessToken;
    return sendResponse(res, 200, "Token refreshed", { accessToken });
  } catch {
    return sendResponse(res, 403, "Invalid refresh token");
  }
});

module.exports = router;
