const express = require("express");
const router = express.Router();
const {
  initiatePaymentController,
  paymentCallbackController,
} = require("../controllers/paymentController");

router.post("/initiate", initiatePaymentController);
router.get("/callback", paymentCallbackController); // Use GET if gateway redirects with query params

module.exports = router;
