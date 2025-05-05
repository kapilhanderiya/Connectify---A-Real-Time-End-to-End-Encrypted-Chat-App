import Message from "../models/message.models.js";
import User from "../models/user.models.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Controller to fetch users for the sidebar (excluding the logged-in user)
export const getUsersForSideBar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id; // Get the logged-in user's ID
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password"); // Fetch all users except the logged-in user and exclude passwords
        res.status(200).json(filteredUser); // Respond with the list of users
    } catch (error) {
        console.log("Error in sidebar user: ", error.message);
        res.status(500).json({ error: "Internal server error" }); // Respond with a server error
    }
};

// Controller to fetch messages between the logged-in user and another user
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // Extract the ID of the user to chat with from the request parameters
        const myId = req.user._id; // Get the logged-in user's ID

        // Fetch messages where the logged-in user is either the sender or receiver
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages); // Respond with the fetched messages
    } catch (error) {
        console.log("Error in getMessage controller", error.message); // Log the error
        res.status(500).json({ error: "Internal server error." }); // Respond with a server error
    }
};

// Controller to send a new message
export const sendMessages = async (req, res) => {
    try {
        const { text } = req.body; // Extract the message text from the request body
        const { id: receiverId } = req.params; // Extract the receiver's ID from the request parameters
        const myId = req.user._id; // Get the logged-in user's ID

        // Create a new message object
        const newMessage = new Message({
            senderId: myId,
            receiverId,
            text,
        });

        await newMessage.save(); // Save the new message to the database

        // Emit the new message to the receiver via socket.io if the receiver is online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // Notify the receiver of the new message
        }

        res.status(201).json(newMessage); // Respond with the created message
    } catch (error) {
        console.log("Error in sendMessages controller", error.message); // Log the error
        res.status(500).json({ error: "Internal server error." }); // Respond with a server error
    }
};

// Controller to delete all messages of the logged-in user
export const deleteUserMessages = async (req, res) => {
    try {
        const userId = req.user._id; // Get the logged-in user's ID

        // Delete all messages where the user is either the sender or the receiver
        await Message.deleteMany({
            $or: [{ senderId: userId }, { receiverId: userId }],
        });

        res.status(200).json({ message: "Messages deleted successfully." }); // Respond with a success message
    } catch (error) {
        console.error("Error deleting user messages:", error); // Log the error
        res.status(500).json({ error: "Failed to delete messages." }); // Respond with a server error
    }
};