import jwt from "jsonwebtoken"; // Import the JSON Web Token (JWT) library for token generation

// Function to generate a JWT token and set it as a cookie in the response
export const generateToken = (userId, res) => {
    // Generate a JWT token with the user ID as the payload
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Set the token to expire in 7 days
    });

    // Set the JWT token as a cookie in the response
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // Set the cookie to expire in 7 days (in milliseconds)
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie (mitigates XSS attacks)
        sameSite: process.env.NODE_ENV === "development" ? "None" : "Lax", // Mitigate CSRF attacks based on the environment
        secure: process.env.NODE_ENV === "development", // Use secure cookies only in production (requires HTTPS)
    });

    return token; // Return the generated token
};