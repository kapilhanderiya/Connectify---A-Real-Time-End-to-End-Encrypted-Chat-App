import { create } from "zustand"; // Import Zustand for state management
import { axiosInstance } from "../lib/axios.js"; 
import toast from "react-hot-toast"; 
import { io } from "socket.io-client"; // Import Socket.IO client for real-time communication
import {
  generateKeyPair,
  savePrivateKeyToIndexedDB,
  exportPublicKey,
  deletePrivateKeyFromIndexedDB,
} from "../utils/cryptoUtils"; // Import utility functions for encryption

import { deleteSentMessagesDB } from "./useChatStore.js"; // Import function to clear sent messages database

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5073" : "/"; // Set the base URL based on the environment

export const useAuthStore = create((set, get) => ({
  authUser: null, // State to store the authenticated user
  isSigningUp: false, // State to indicate if the user is signing up
  isLoggingIn: false, // State to indicate if the user is logging in
  isUpdatingProfile: false, // State to indicate if the profile is being updated
  isCheckingAuth: true, // State to indicate if authentication is being checked
  onlineUsers: [], // State to store the list of online users
  socket: null, // State to store the Socket.IO instance

  // Function to check if the user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // Send a request to check authentication
      set({ authUser: res.data }); // Set the authenticated user
      get().connectSocket(); // Connect to the socket
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null }); // Clear the authenticated user on error
    } finally {
      set({ isCheckingAuth: false }); // Set the checking state to false
    }
  },

  // Function to handle user signup
  signup: async (data) => {
    set({ isSigningUp: true }); // Set the signing up state to true
    try {
      const res = await axiosInstance.post("/auth/signup", data); // Send signup request

      // Generate key pair for encryption
      const { publicKey, privateKey } = await generateKeyPair();
      await savePrivateKeyToIndexedDB(privateKey); // Save private key locally

      // Export public key and send it to the backend
      const exportedPublicKey = await exportPublicKey(publicKey);
      await axiosInstance.post("/auth/save-public-key", {
        email: data.email,
        publicKey: exportedPublicKey,
      });

      set({ authUser: res.data }); // Set the authenticated user
      toast.success("Account created successfully"); // Show success message
      get().connectSocket(); // Connect to the socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isSigningUp: false }); // Set the signing up state to false
    }
  },

  // Function to handle user login
  login: async (data) => {
    set({ isLoggingIn: true }); // Set the logging in state to true
    try {
      const res = await axiosInstance.post("/auth/login", data); // Send login request

      // Generate key pair for encryption
      const { publicKey, privateKey } = await generateKeyPair();
      await savePrivateKeyToIndexedDB(privateKey); // Save private key locally

      // Export public key and send it to the backend
      const exportedPublicKey = await exportPublicKey(publicKey);
      await axiosInstance.post("/auth/save-public-key", {
        email: data.email,
        publicKey: exportedPublicKey,
      });

      set({ authUser: res.data }); // Set the authenticated user
      toast.success("Logged in successfully"); // Show success message
      get().connectSocket(); // Connect to the socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isLoggingIn: false }); // Set the logging in state to false
    }
  },

  // Function to handle user logout
  logout: async () => {
    try {
      await axiosInstance.delete("/messages/deleteAllMessages"); // Delete all messages
      await axiosInstance.post("/auth/logout"); // Send logout request
      await deletePrivateKeyFromIndexedDB(); // Delete private key locally
      await deleteSentMessagesDB(); // Clear sent messages database

      set({ authUser: null }); // Clear the authenticated user
      toast.success("Logged out successfully"); // Show success message
      get().disconnectSocket(); // Disconnect from the socket
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    }
  },

  // Function to update user profile
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true }); // Set the updating profile state to true
    try {
      const res = await axiosInstance.put("/auth/update-profile", data); // Send update profile request
      set({ authUser: res.data }); // Update the authenticated user
      toast.success("Profile updated successfully"); // Show success message
    } catch (error) {
      console.log("Error in update profile:", error);
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isUpdatingProfile: false }); // Set the updating profile state to false
    }
  },

  // Function to connect to the socket
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return; // Return if no user or already connected

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id, // Pass the user ID as a query parameter
      },
    });
    socket.connect(); // Connect to the socket

    set({ socket: socket }); // Set the socket instance

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds }); // Update the list of online users
    });
  },

  // Function to disconnect from the socket
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect(); // Disconnect the socket if connected
  },
}));