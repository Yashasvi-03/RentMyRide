const express = require("express");
const router = express.Router();

const { addCar, updateCar, deleteCar, getMyCars } = require("../controllers/carController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { getCars } = require("../controllers/carController");

// Public route
router.get("/", getCars);
// Add car
router.post("/add", protect, authorizeRoles("admin","agency"), addCar);

// Update car
router.put("/:id", protect, authorizeRoles("admin","agency"), updateCar);

// Delete car
router.delete("/:id", protect, authorizeRoles("admin","agency"), deleteCar);


//only agecy loggin cars
router.get("/my",protect,authorizeRoles("agency"),getMyCars)
module.exports = router;