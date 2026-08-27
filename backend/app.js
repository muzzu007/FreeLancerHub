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
const http = require("http");
const { Server } = require("socket.io");
const initializeSocket =
    require("./socket/socketHandler");


const app = express();
app.set('trust proxy', 1);
const server =
    http.createServer(app);

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

initializeSocket(io);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later."
    },
    skip: (req) => req.path.startsWith('/socket.io/')
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
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.get("/", (req,res)=>{
    res.json({
        message: "Freelance hub is running",
    });
});
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, ()=>{
    console.log(`Server started of port ${PORT}`);
});