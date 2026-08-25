const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const crypto = require("crypto");
const { protect } = require("../middleware/authMiddleware");
const RefreshToken = require("../models/RefreshToken")
const rateLimit = require("express-rate-limit");

const router = express.Router();

const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex")
}

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many authentication attempts, please try again later"
    }
});

router.post("/register", authLimiter, async (req, res, next) => {
    try {
        const {
            name,
            email: rawEmail,
            password,
            role
        } = req.body;

        // 1. Basic type validation
        if (
            typeof name !== "string" ||
            typeof rawEmail !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(422).json({
                message: "Please provide valid registration details"
            });
        }

        // 2. Clean input
        const cleanName = name.trim();
        const cleanEmail = rawEmail.trim().toLowerCase();

        // 3. Validate name
        if (cleanName.length < 2) {
            return res.status(422).json({
                message: "Name must be at least 2 characters"
            });
        }

        // 4. Validate email
        if (!cleanEmail.includes("@")) {
            return res.status(422).json({
                message: "Please enter a valid email address"
            });
        }

        // 5. Validate password
        if (password.length < 6) {
            return res.status(422).json({
                message: "Password must be at least 6 characters"
            });
        }

        // 6. Validate role
        if (!["client", "freelancer"].includes(role)) {
            return res.status(422).json({
                message: "Invalid account type"
            });
        }

        // 7. Check whether email already exists
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        // 8. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 9. Create user
        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword,
            role
        });

        // 10. Send response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});


router.post("/login", authLimiter, async (req, res, next) => {
    try {
        const {
            email: rawEmail,
            password
        } = req.body;

        const email = rawEmail.trim().toLowerCase();

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account has been suspended"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        )
        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }
        const token = jwt.sign({
            userId: user._id,
            role: user.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m",
            }
        );
        const refreshToken = generateRefreshToken();
        const refreshTokenExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );
        await RefreshToken.create({
            token: refreshToken,
            user: user._id,
            expiresAt: refreshTokenExpiry
        });

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({
            message: "Login Sucessfull",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,

            }
        });
    } catch (error) {
        next(error);
    }
});

router.post("/logout", async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            await RefreshToken.deleteOne({
                token: refreshToken
            });
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });

        res.status(200).json({
            message: "Logout Successfully"
        });

    } catch (error) {
        next(error);
    }
});

router.post("/refresh", async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token required",
            });
        }
        const storedToken = await RefreshToken.findOne({
            token: refreshToken,
        })

        if (!storedToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }
        if (storedToken.expiresAt < new Date()) {
            await RefreshToken.deleteOne({
                _id: storedToken._id
            });
            return res.status(401).json({
                message: "Refresh token expired"
            });
        }
        const user = await User.findById(storedToken.user);
        if (!user) {
            await RefreshToken.deleteOne({
                _id: storedToken._id
            });
            return res.status(401).json({
                message: "user not found",
            })
        }

        if (!user.isActive) {
            await RefreshToken.deleteOne({
                _id: storedToken._id
            });

            return res.status(403).json({
                message: "Your account has been suspended"
            });
        }
        const newAccessToken = jwt.sign({
            userId: user._id,
            role: user.role
        },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            });

        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenExpiry = new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        await RefreshToken.deleteOne({
            _id: storedToken._id
        });

        await RefreshToken.create({
            token: newRefreshToken,
            user: user._id,
            expiresAt: newRefreshTokenExpiry
        });


        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Access token refreshed"
        });
    } catch (error) {
        next(error)

    }
});


router.get("/me", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
});

module.exports = router;