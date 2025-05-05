import mongoose from "mongoose"; 

// Define the schema for the Message model
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the sender's user ID
      ref: "User", // Reference to the User model
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the receiver's user ID
      ref: "User", // Reference to the User model
      required: true, 
    },
    text: {
      type: String, // The text content of the message
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the Message model using the schema
const Message = mongoose.model("Message", messageSchema);

export default Message;