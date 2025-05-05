import mongoose from "mongoose"; // Import the Mongoose library for MongoDB interaction

// Define the schema for the User model
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String, // The user's email address
            required: true,
            unique: true, // Ensure the email is unique in the database
        },
        fullName: {
            type: String, // The user's full name
            required: true,
        },
        password: {
            type: String, // The user's hashed password
            required: true,
            minLength: 8, // Minimum length for the password
        },
        profilePicture: {
            type: String, // URL of the user's profile picture
            default: "",
        },
        publicKey: {
            type: String, // The user's public key for encryption (optional)
            required: false,
        },
    },
    { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Create the User model using the schema
const User = mongoose.model("User", userSchema);

export default User;