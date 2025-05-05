import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom"; // Import Link for navigation

import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    fullName: "", // State for the full name input
    email: "", // State for the email input
    password: "", // State for the password input
  });

  const { signup, isSigningUp } = useAuthStore(); // Get the signup function and loading state from the auth store

  // Function to validate the form inputs
  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required"); // Check if full name is empty
    if (!formData.email.trim()) return toast.error("Email is required"); // Check if email is empty
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format"); // Validate email format
    if (!formData.password) return toast.error("Password is required"); // Check if password is empty
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters"); // Check password length

    return true; // Return true if all validations pass
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const success = validateForm(); // Validate the form inputs

    if (success === true) signup(formData); // Call the signup function if validation passes
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="John Doe"
                  value={formData.fullName} // Bind the input value to the full name state
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} // Update the full name state on input change
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email} // Bind the input value to the email state
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} // Update the email state on input change
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password input types
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  value={formData.password} // Bind the input value to the password state
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update the password state on input change
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? <EyeOff /> : <Eye />} {/* Show/hide password icon */}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" /> {/* Loading spinner */}
                  Loading...
                </>
              ) : (
                "Create Account" // Button text
              )}
            </button>
          </form>
          <div className="text-center">
            <p className="text-base-content/60">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Pattern */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
