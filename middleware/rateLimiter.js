const rateLimit = require("express-rate-limit");

const resendVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "Too many resend attempts. Try again later." },
  keyGenerator: (req) => req.body.email || req.ip,
});

module.exports = { resendVerificationLimiter };
