import { generateToken } from "../lib/utils.js";
import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

// Controller for user signup
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        // Validate required fields
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be of at least 8 characters" });
        }

        // Check if the email already exists in the database
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "Email already exists" });

        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user object
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            // Generate a JWT token for the user
            generateToken(newUser._id, res);

            // Save the new user to the database
            await newUser.save();

            // Respond with the created user's details
            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in signup", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller for user login
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Generate a JWT token for the user
        generateToken(user._id, res);

        // Respond with the user's details
        res.status(201).json({
            _id: user._id,
            fullname: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in login", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller for user logout
export const logout = (req, res) => {
    try {
        // Clear the JWT cookie by setting its maxAge to 0
        res.cookie("jwt", "", {
            maxAge: 0,
        });

        // Respond with a success message
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in logout", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller for updating the user's profile picture
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        // Validate if the profile picture is provided
        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required." });
        }

        // Upload the profile picture to Cloudinary
        const uploadRes = await cloudinary.uploader.upload(profilePic);

        // Update the user's profile picture in the database
        const updateUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadRes.secure_url }, { new: true });

        // Respond with the updated user details
        res.status(200).json(updateUser);
    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in update profile: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to check if the user is authenticated
export const checkAuth = (req, res) => {
    try {
        // Respond with the authenticated user's details
        res.status(200).json(req.user);
    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in checkAuth", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller to save a user's public key
export const savePublicKey = async (req, res) => {
    const { email, publicKey } = req.body;
    try {
        // Find the user by email and update their public key
        const user = await User.findOne({ email });
        await User.findByIdAndUpdate(user._id, { publicKey });

        // Respond with a success message
        res.status(200).json({ message: "Public key saved" });
    } catch (err) {
        // Respond with a server error
        res.status(500).json({ error: "Failed to save key" });
    }
};

// Controller to fetch a user's public key by user ID
export const key = async (req, res) => {
    try {
        // Find the user by ID and select only the public key field
        const user = await User.findById(req.params.userId).select("publicKey");

        // Respond with the user's public key
        res.status(200).json(user);
    } catch (err) {
        // Respond with a server error
        res.status(500).json({ error: "Failed to fetch public key" });
    }
};

// Controller to delete a user's public key
export const deletePublicKey = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Remove the public key from the user's record
        user.publicKey = undefined;
        await user.save();

        // Respond with a success message
        res.status(200).json({ message: "Public key deleted successfully." });
    } catch (error) {
        // Log the error and respond with a server error
        console.error("Error deleting public key:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
};