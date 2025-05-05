import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { server, app } from "./lib/socket.js";

dotenv.config(); // Load environment variables from the .env file

const PORT = process.env.PORT; // Get the port number from environment variables

// Middlewares
app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from the frontend's origin
  credentials: true, // Allow credentials (cookies) to be sent with requests
}));

// API Routes
app.use("/api/auth", authRoutes); // Mount authentication routes at /api/auth
app.use("/api/messages", messageRoutes); // Mount message routes at /api/messages

// Start the HTTP & Socket.IO server
server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`); // Log the server's listening port
  connectDB(); // Connect to the MongoDB database
});