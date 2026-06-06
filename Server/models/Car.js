const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
    {
        name: String,
        brand: String,

        type: {   //   (SUV, Sedan, Hatchback)
            type: String,
        },

        fuelType: {   
            type: String,
        },

        seatingCapacity: {   
            type: Number,
        },

        pricePerDay: Number,

        image: String,

        available: {
            type: Boolean,
            default: true,
        },

        location: {   
            type: String,
        },

        agency: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Car", carSchema);