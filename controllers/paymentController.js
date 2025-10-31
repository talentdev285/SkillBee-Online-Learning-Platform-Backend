const Order = require("../models/Order");
const { initiatePayment } = require("../services/paymentGatewayService"); // Your payment gateway service

// @desc    Initiate a new payment
// @route   POST /api/payment/initiate
// @access  Public (or Private if users need to be logged in)
const initiatePaymentController = async (req, res) => {
  const {
    courseId,
    courseName,
    subtotal,
    discount,
    totalPayment,
    paymentMethod,
  } = req.body;

  // Basic validation
  if (
    !courseId ||
    !courseName ||
    subtotal === undefined ||
    discount === undefined ||
    totalPayment === undefined ||
    !paymentMethod
  ) {
    return res
      .status(400)
      .json({ message: "Missing required payment details." });
  }

  try {
    // 1. Create a new order in your database
    const newOrder = new Order({
      // userId: req.user._id, // Uncomment if using authentication and req.user is populated
      courseId,
      courseName,
      subtotal,
      discount,
      totalPayment,
      paymentMethod,
      status: "pending", // Initial status
    });

    await newOrder.save();
    console.log("Order created in DB:", newOrder._id);

    // 2. Initiate payment with the selected gateway
    const paymentGatewayResponse = await initiatePayment(
      newOrder,
      paymentMethod
    );

    if (!paymentGatewayResponse || !paymentGatewayResponse.redirectUrl) {
      newOrder.status = "failed";
      await newOrder.save();
      return res
        .status(500)
        .json({ message: "Failed to initiate payment with gateway." });
    }

    // 3. Update order with gateway's transaction ID and redirect URL
    newOrder.transactionId = paymentGatewayResponse.transactionId;
    newOrder.redirectUrl = paymentGatewayResponse.redirectUrl;
    await newOrder.save();
    console.log("Payment initiated successfully. Redirecting...");

    // 4. Send the redirect URL back to the frontend
    res.status(200).json({
      message: "Payment initiated successfully.",
      redirectUrl: paymentGatewayResponse.redirectUrl,
      orderId: newOrder._id,
      transactionId: newOrder.transactionId,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      message: "Internal server error during payment initiation.",
      error: error.message,
    });
  }
};

// Add a callback route for payment gateway to notify your backend
// This is crucial for verifying payment status after the user completes payment on the gateway's side.
// Example:
const paymentCallbackController = async (req, res) => {
  // This route will be hit by the payment gateway after the user completes (or cancels) payment.
  // The exact request body/query parameters will depend on the gateway.
  console.log("Payment Gateway Callback received:", req.query, req.body);

  const { orderId, status, transactionId } = req.query; // Example, adjust based on gateway
  // const { orderId, transactionId, paymentStatus } = req.body; // Another example

  if (!orderId || !transactionId) {
    return res.status(400).json({ message: "Missing callback parameters." });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Verify payment status with the gateway (IMPORTANT for security)
    // You would typically make another API call to the gateway to confirm the transaction.
    // For demonstration, we'll assume the status from the callback is reliable.
    if (status === "success") {
      order.status = "completed";
      order.transactionId = transactionId; // Ensure this matches if not set initially
      // Further actions: enroll user in course, send confirmation email, etc.
      console.log(`Order ${orderId} completed!`);
    } else if (status === "failed" || status === "cancelled") {
      order.status = status;
      console.log(`Order ${orderId} ${status}.`);
    } else {
      order.status = "pending_verification"; // Or a specific status for unknown
    }

    await order.save();

    // Redirect the user back to your frontend's success/failure page
    // This is typically handled by the gateway itself after the callback,
    // or you can instruct the gateway to redirect directly to a frontend URL.
    // For now, send a simple response.
    res
      .status(200)
      .json({ message: `Order ${orderId} status updated to ${order.status}` });

    // In a real scenario, you might redirect the user's browser from the *gateway*
    // to a frontend success/failure page, e.g.,
    // res.redirect(`${process.env.FRONTEND_URL}/payment-status/${orderId}`);
  } catch (error) {
    console.error("Error processing payment callback:", error);
    res
      .status(500)
      .json({ message: "Internal server error during callback processing." });
  }
};

module.exports = {
  initiatePaymentController,
  paymentCallbackController,
};
