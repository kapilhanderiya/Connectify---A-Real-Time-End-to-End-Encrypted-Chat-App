import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; 
import { LogOut, MessageSquare, Settings, User } from "lucide-react"; 

const Navbar = () => {
  const { logout, authUser } = useAuthStore(); // Get the logout function and authenticated user details from the auth store

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left section of the navbar */}
          <div className="flex items-center gap-8">
            {/* Logo and app name */}
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" /> {/* Chat icon */}
              </div>
              <h1 className="text-lg font-bold">Connectify</h1> {/* App name */}
            </Link>
          </div>

          {/* Right section of the navbar */}
          <div className="flex items-center gap-2">
            {/* Settings button */}
            <Link
              to={"/settings"}
              className={`btn btn-sm gap-2 transition-colors`}
            >
              <Settings className="w-4 h-4" /> {/* Settings icon */}
              <span className="hidden sm:inline">Settings</span> {/* Text visible on larger screens */}
            </Link>

            {/* Show profile and logout buttons if the user is authenticated */}
            {authUser && (
              <>
                {/* Profile button */}
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" /> {/* Profile icon */}
                  <span className="hidden sm:inline">Profile</span> {/* Text visible on larger screens */}
                </Link>

                {/* Logout button */}
                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" /> {/* Logout icon */}
                  <span className="hidden sm:inline">Logout</span> {/* Text visible on larger screens */}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;