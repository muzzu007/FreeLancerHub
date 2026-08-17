const jwt = require("jsonwebtoken");
const User = require("../models/User")

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await User.findById(decoded.userId)
            .select("isActive");

        if (!user) {
            return res.status(401).json({
                message: "User no longer exists"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been suspended"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid authentication token"
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Authentication token expired"
            });
        }

        next(error);

    }
};

const authorize = (...allowedRoles) =>{
    return (req,res,next) =>{
        if(!req.user){
            return res.status(401).json({
                message: "Authentication required"
            });

        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({
                message:"Access Denied"
            });
        }
    next();
    }

}
module.exports = {protect,authorize};