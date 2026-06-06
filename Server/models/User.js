const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required:true,
        },
        contactNumber: {
            type: String,
            required: true
        },


        role: {
            type: String,
            enum: ["admin", "agency", "customer"],
            default: "customer",
        },

        // Agency specific fields
        agencyName: String,
        isApproved: {
            type: Boolean,
            default: false,
        },
        resetOTP:String,
        otpExpire:Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);