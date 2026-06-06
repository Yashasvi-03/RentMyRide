const Car = require("../models/Car");

//  Add Car
exports.addCar = async (req, res) => {
    try {
        const { name, brand, pricePerDay, images, type, fuelType, seatingCapacity, location } = req.body;
        //  ADD VALIDATION HERE 
        console.log(req.body)
        if (!name || !pricePerDay) {
            return res.status(400).json({ message: "All fields required" });
        }

        const car = await Car.create({
            name,
            brand,
            type,
            pricePerDay,
            image: images?.[0] || "",
            fuelType,
            seatingCapacity,
            location,
            agency: req.user._id,
        });

        res.status(201).json(car);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  Update Car (ONLY owner agency)
exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        //  Ownership check
        if (car.agency.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const updatedCar = await Car.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                image: req.body.images?.[0] || req.body.image
            },

            {
                new: true,
                returnDocument: "after"
            }
        );

        res.json(updatedCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Car (ONLY owner agency)
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        // Ownership check
        if (car.agency.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await car.deleteOne();

        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



//Get all cars with search & filter
exports.getCars = async (req, res) => {
    try {
        const { location, minPrice, maxPrice, type } = req.query;

        let query = {};

        //  Location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        //  Price filter
        if (minPrice && maxPrice) {
            query.pricePerDay = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice),
            };
        }

        //  Type filter
        if (type) {
            query.type = type;
        }

        // Only available cars
        query.available = true;

        const cars = await Car.find(query).populate("agency", "name agencyName");

        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get ONLY logged-in agency cars
exports.getMyCars = async (req, res) => {
    try {
        const cars = await Car.find({ agency: req.user._id }).populate("agency","name");

        res.json(cars);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};