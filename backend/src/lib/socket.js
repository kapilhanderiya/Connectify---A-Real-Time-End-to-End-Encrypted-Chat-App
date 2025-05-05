import { Server } from "socket.io"; 
import http from "http"; 
import express from "express"; 

const app = express(); 
const server = http.createServer(app); 

// Initialize a new instance of Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Allow requests from any origin
  },
});

// Function to get the socket ID of a specific user by their user ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId]; // Return the socket ID from the userSocketMap
}

// Object to store online users and their corresponding socket IDs
const userSocketMap = {}; // { userId: socketId }

// Event listener for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id); // Log when a user connects

  // Retrieve the user ID from the socket handshake query
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id; // Map the user ID to the socket ID

  // Emit the list of online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Event listener for socket disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id); // Log when a user disconnects
    delete userSocketMap[userId]; // Remove the user from the userSocketMap
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Update the list of online users
  });
});

// Export the Socket.IO instance, Express app, and HTTP server for use in other parts of the application
export { io, app, server };