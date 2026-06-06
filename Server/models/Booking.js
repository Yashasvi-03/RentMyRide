const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
        },

        fromDate: Date,
        toDate: Date,
        totalAmount: Number,

        
        address: {
            type: String,
            required: true,
        },

        city: String,
        pincode: String,

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid","refunded"],
            default: "pending",
        },
        razorpayPaymentId:String,
        refundAmount:Number,
        isRefunded:Boolean,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);