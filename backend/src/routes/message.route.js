import express from "express";
import { 
    getUsersForSideBar, 
    getMessages, 
    sendMessages, 
    deleteUserMessages 
} from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router(); // Create a new router instance

// Route to fetch users for the sidebar (protected route)
router.get("/users", protectRoute, getUsersForSideBar);

// Route to fetch messages between the logged-in user and another user (protected route)
router.get("/:id", protectRoute, getMessages);

// Route to send a new message to another user (protected route)
router.post("/send/:id", protectRoute, sendMessages);

// Route to delete all messages of the logged-in user (protected route)
router.delete("/deleteAllMessages", protectRoute, deleteUserMessages);

export default router;