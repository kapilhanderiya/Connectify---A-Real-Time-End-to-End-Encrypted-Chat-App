import mongoose from "mongoose";

// Function to connect to the MongoDB database
export const connectDB = async () => {
  try {
    // Connect to the MongoDB database using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log a success message with the host of the connected database
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log an error message if the connection fails
    console.log("MongoDB connection error:", error);
  }
};