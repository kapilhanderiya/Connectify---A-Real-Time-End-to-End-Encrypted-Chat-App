import jwt from "jsonwebtoken"; 
import User from "../models/user.models.js";
// Middleware to protect routes by verifying the user's authentication
export const protectRoute = async (req, res, next) => {
    try {
        // Retrieve the JWT token from the cookies
        const token = req.cookies.jwt;

        // Check if the token is not provided
        if (!token) {
            return res.status(401).json({ message: "Unauthorised - No Token Provided." }); // Respond with an unauthorized error
        }

        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is invalid
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorised - Invalid Token." }); // Respond with an unauthorized error
        }

        // Find the user in the database using the decoded user ID and exclude the password field
        const user = await User.findById(decoded.userId).select("-password");

        // Check if the user does not exist
        if (!user) {
            return res.status(404).json({ message: "User not Found." }); // Respond with a not found error
        }

        // Attach the user object to the request for use in subsequent middleware or routes
        req.user = user;

        // Proceed to the next middleware or route handler
        next();

    } catch (error) {
        // Log the error and respond with a server error
        console.log("Error in protect Route: ", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
};