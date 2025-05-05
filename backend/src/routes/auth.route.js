import express from "express";
import { 
    login, 
    logout, 
    signup, 
    updateProfile, 
    checkAuth, 
    key, 
    deletePublicKey, 
    savePublicKey 
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router(); // Create a new router instance

// Route to handle user signup
router.post("/signup", signup);

// Route to handle user login
router.post("/login", login);

// Route to handle user logout
router.post("/logout", logout);

// Route to update the user's profile (protected route)
router.put("/update-profile", protectRoute, updateProfile);

// Route to check if the user is authenticated (protected route)
router.get("/check", protectRoute, checkAuth);

// Route to save the user's public key
router.post("/save-public-key", savePublicKey);

// Route to fetch a user's public key by user ID
router.get("/public-key/:userId", key);

// Route to delete a user's public key by user ID
router.delete("/public-key/:userId", deletePublicKey);

export default router; 