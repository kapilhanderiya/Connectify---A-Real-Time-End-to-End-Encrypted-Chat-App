import { useState } from "react"; 
import { useAuthStore } from "../store/useAuthStore"; 
import AuthImagePattern from "../components/AuthImagePattern"; 
import { Link } from "react-router-dom"; 
import { MessageSquare } from "lucide-react"; 
import { LuEye, LuEyeOff, LuLoaderCircle, LuLockKeyhole, LuMail } from "react-icons/lu"; 

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [formData, setFormData] = useState({
    email: "", // State for the email input
    password: "", // State for the password input
  });
  const { login, isLoggingIn } = useAuthStore(); // Get the login function and loading state from the auth store

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    login(formData); // Call the login function with the form data
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20
              transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" /> {/* Chat icon */}
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1> {/* Heading */}
              <p className="text-base-content/60">Sign in to your account</p> {/* Subheading */}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuMail className="h-5 w-5 text-base-content/40" /> {/* Email icon */}
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com" // Placeholder text
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
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LuLockKeyhole className="h-5 w-5 text-base-content/40" /> {/* Password icon */}
                </div>
                <input
                  type={showPassword ? "text" : "password"} // Toggle between text and password input types
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••" // Placeholder text
                  value={formData.password} // Bind the input value to the password state
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })} // Update the password state on input change
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                >
                  {showPassword ? (
                    <LuEyeOff className="h-5 w-5 text-base-content/40" /> // Eye-off icon for hidden password
                  ) : (
                    <LuEye className="h-5 w-5 text-base-content/40" /> // Eye icon for visible password
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <LuLoaderCircle className="h-5 w-5 animate-spin" /> {/* Loading spinner */}
                  Loading...
                </>
              ) : (
                "Sign in" // Button text
              )}
            </button>
          </form>

          {/* Link to Signup Page */}
          <div className="text-center">
            <p className="text-base-content/60">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="link link-primary">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;