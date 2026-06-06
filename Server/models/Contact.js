// import mongoose from "mongoose";

// const contactSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true },
//         message: { type: String, required: true },

//         reply: { type: String }, // admin reply
//         replied: { type: Boolean, default: false },
//     },
//     { timestamps: true }
// );

// export default mongoose.model("Contact", contactSchema);




const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    reply: String,
    replied: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);