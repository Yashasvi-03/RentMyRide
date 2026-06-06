// Role check middleware

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
           return  res.status(401).json({message:"User not found"})
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `Access denied. Role (${req.user.role}) not allowed`,
            });
        }
        return next();
    };
};

module.exports = authorizeRoles;