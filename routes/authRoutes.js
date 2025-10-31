const express = require("express");
const router = express.Router();

// all about auth router
const {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgetPassword,
  resetPassword, // ✅ Used correctly below
} = require("../controllers/authController");

// Protected router imported here
const {
  protectedDashboard,
} = require("../routes/protected_routes/protectedRoute");

// verification limiter imported here
const { resendVerificationLimiter } = require("../middleware/rateLimiter");

// All router bellow
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post(
  "/resend-verification",
  resendVerificationLimiter,
  resendVerification
);

router.post("/login", loginUser);
router.post("/forget-password", forgetPassword);

// ✅ Correct reset password route
router.post("/reset-password/:token", resetPassword);

// Optional GET routes
router.get("/dashboard", protectedDashboard, (req, res) => {
  res.status(200).json({
    message: `Welcome to your dashboard, user ${req.user.userId}`,
  });
});

module.exports = router;
