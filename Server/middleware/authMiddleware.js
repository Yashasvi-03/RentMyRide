const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    console.log("Protect middleware HIT");
    
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")


    ) {
        try {
            console.log("Header", req.headers.authorization);
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            return next();
        } catch (error) {
            console.log("JWT Error:-",error.message);
            
            return res.status(401).json({ message: "Not authorized" });
        }
    }
    console.log("No token found");
    

    return res.status(401).json({ message: "No token" });
};

module.exports = protect;