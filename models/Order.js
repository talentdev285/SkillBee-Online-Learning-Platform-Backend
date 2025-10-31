const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // If you have user authentication
      ref: "User",
      required: false, // Make true if users must be logged in
    },
    courseId: {
      type: Number, // Assuming courseId is a number from your frontend data
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalPayment: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bkash", "nagad", "mastercard"], // Enforce allowed methods
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    transactionId: {
      type: String, // Store transaction ID from payment gateway
      required: false,
    },
    redirectUrl: {
      type: String, // Store the URL provided by the payment gateway
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
