const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const proposalRoutes = require("./routes/proposal");
const errorHandler = require("./middleware/errorMiddleware");
const reviewRoutes = require("./routes/review");
const adminRoutes = require("./routes/admin");
const chatRoutes = require("./routes/chat");


const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later."
    }
});
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

connectDB();
app.use(limiter);
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/projects",projectRoutes);
app.use("/proposals", proposalRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin", adminRoutes);
app.use("/conversations", chatRoutes);
app.get("/", (req,res)=>{
    res.json({
        message: "Freelance hub is running",
    });
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server started of port ${PORT}`);
});