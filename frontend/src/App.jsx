import React, { useEffect } from 'react';
import Navbar from './components/Navbar'; // Import the Navbar component
import { Navigate, Route, Routes } from 'react-router-dom'; // Import routing components
import HomePage from "./Pages/HomePage"; // Import the HomePage component
import SignUpPage from "./Pages/SignUpPage"; // Import the SignUpPage component
import LoginPage from "./Pages/LoginPage"; // Import the LoginPage component
import SettingsPage from "./Pages/SettingsPage"; // Import the SettingsPage component
import ProfilePage from "./Pages/ProfilePage"; // Import the ProfilePage component
import { useAuthStore } from './store/useAuthStore'; // Import the auth store for managing authentication-related state
import { useThemeStore } from "./store/useThemeStore"; // Import the theme store for managing theme-related state
import { FiLoader } from "react-icons/fi"; // Import a loader icon
import { Toaster } from "react-hot-toast"; // Import the Toaster for notifications

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore(); // Get authentication-related state and functions
  const { theme } = useThemeStore(); // Get the current theme

  // Check authentication status when the app loads
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser }); // Log the authenticated user for debugging

  // Show a loading spinner while checking authentication
  if (isCheckingAuth && !authUser) return (
    <div className='flex items-center justify-center h-screen'>
      <FiLoader className='size-10 animate-spin' /> {/* Loading spinner */}
    </div>
  );

  return (
    <div data-theme={theme}> {/* Apply the selected theme */}
      <Navbar /> {/* Render the Navbar component */}

      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />

        {/* Route for the signup page */}
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />

        {/* Route for the login page */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />

        {/* Route for the settings page */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* Route for the profile page */}
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster /> {/* Render the Toaster for notifications */}
    </div>
  );
};

export default App; 