import { create } from "zustand"; // Import Zustand for state management
import toast from "react-hot-toast"; 
import { axiosInstance } from "../lib/axios"; 
import { useAuthStore } from "./useAuthStore"; 
import { importPublicKey, encryptMessage } from "../utils/cryptoUtils"; // Import encryption utilities
import { getPrivateKeyFromIndexedDB, decryptMessage } from "../utils/cryptoUtils"; // Import decryption utilities

// Function to open the IndexedDB for storing sent messages
export const openSentMessagesDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("sentMessagesDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("sentMessages")) {
        db.createObjectStore("sentMessages", { keyPath: "id" }); // Create an object store for sent messages
      }
    };

    request.onsuccess = () => resolve(request.result); // Resolve with the database instance
    request.onerror = (event) => reject(event.target.error); // Reject on error
  });
};

// Function to save a sent message to IndexedDB
export const saveSentMessage = async (message) => {
  const db = await openSentMessagesDB();
  const transaction = db.transaction("sentMessages", "readwrite");
  const store = transaction.objectStore("sentMessages");
  store.put(message); // Save the message
  return transaction.complete;
};

// Function to delete all sent messages from IndexedDB
export async function deleteSentMessagesDB() {
  try {
    const db = await openSentMessagesDB();
    const tx = db.transaction("sentMessages", "readwrite");
    tx.objectStore("sentMessages").clear(); // Clear all messages
    await tx.complete;
    console.log("All sent messages deleted from IndexedDB.");
  } catch (error) {
    console.error("Error deleting sent messages from IndexedDB:", error);
    throw new Error("Failed to delete sent messages.");
  }
}

// Function to retrieve all sent messages from IndexedDB
export const getSentMessages = async () => {
  const db = await openSentMessagesDB();
  const transaction = db.transaction("sentMessages", "readonly");
  const store = transaction.objectStore("sentMessages");
  return new Promise((resolve, reject) => {
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result); // Resolve with all messages
    request.onerror = (event) => reject(event.target.error); // Reject on error
  });
};

// Zustand store for managing chat-related state
export const useChatStore = create((set, get) => ({
  messages: [], // State to store chat messages
  users: [], // State to store the list of users
  selectedUser: null, // State to store the currently selected user
  isUserLoading: false, // State to indicate if users are being loaded
  isMessagesLoading: false, // State to indicate if messages are being loaded

  // Function to fetch the list of users
  getUsers: async () => {
    set({ isUserLoading: true }); // Set loading state to true
    try {
      const res = await axiosInstance.get("/messages/users"); // Fetch users from the server
      set({ users: res.data }); // Update the users state
    } catch (error) {
      toast.error(error.response.data.message); // Show error message
    } finally {
      set({ isUserLoading: false }); // Set loading state to false
    }
  },

  // Function to send a message
  sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();

    if (!selectedUser) {
      toast.error("No user selected."); // Show error if no user is selected
      return;
    }

    try {
      // Fetch the recipient's public key
      const { data } = await axiosInstance.get(`/auth/public-key/${selectedUser._id}`);
      const recipientKey = await importPublicKey(data.publicKey);

      // Encrypt the message content
      const encryptedContent = await encryptMessage(recipientKey, messageData.text);

      // Send the encrypted message to the server
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, {
        text: encryptedContent,
      });

      // Add the plaintext version of the sent message to IndexedDB
      const sentMessage = {
        id: res.data._id, // Use the server-generated message ID as the key
        senderId: useAuthStore.getState().authUser._id,
        receiverId: selectedUser._id,
        text: messageData.text, // Store the plaintext message
        createdAt: new Date().toISOString(), // Add the current timestamp
      };
      await saveSentMessage(sentMessage);

      // Update the state with the sent message
      set({
        messages: [...messages, sentMessage],
      });
    } catch (error) {
      console.error("Error sending message:", error); // Log the error for debugging
      toast.error(error.response?.data?.message || "Failed to send message.");
    }
  },

  // Function to fetch messages for a specific user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true }); // Set loading state to true

    try {
      // Fetch encrypted messages from the server
      const res = await axiosInstance.get(`/messages/${userId}`);
      const encryptedMessages = res.data;

      // Get the logged-in user's ID
      const myId = useAuthStore.getState().authUser._id;

      // Separate received messages
      const receivedMessages = encryptedMessages.filter(
        (message) => message.receiverId === myId
      );

      // Decrypt received messages
      const privateKey = await getPrivateKeyFromIndexedDB();
      const decryptedReceivedMessages = await Promise.all(
        receivedMessages.map(async (message) => {
          const decryptedContent = await decryptMessage(privateKey, message.text);
          return { ...message, text: decryptedContent };
        })
      );

      // Retrieve sent messages from IndexedDB
      const sentMessages = await getSentMessages();
      const relevantSentMessages = sentMessages.filter(
        (message) => message.receiverId === userId
      );

      // Combine sent and received messages
      const allMessages = [...decryptedReceivedMessages, ...relevantSentMessages];

      // Sort messages by timestamp
      allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // Update the state with all messages
      set({ messages: allMessages });
    } catch (error) {
      console.error("Error fetching messages:", error); // Log the error for debugging
      toast.error(error.response?.data?.message || "Failed to fetch messages.");
    } finally {
      set({ isMessagesLoading: false }); // Set loading state to false
    }
  },

  // Function to subscribe to real-time message updates
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", async (newMessage) => {
      try {
        const myId = useAuthStore.getState().authUser._id;

        // Check if the message is sent to the logged-in user
        if (newMessage.receiverId !== myId) return;

        // Decrypt the message
        const privateKey = await getPrivateKeyFromIndexedDB();
        const decryptedContent = await decryptMessage(privateKey, newMessage.text);

        // Update the state with the decrypted message
        set((state) => ({
          messages: [
            ...state.messages,
            { ...newMessage, text: decryptedContent }, // Replace encrypted text with decrypted content
          ],
        }));
      } catch (error) {
        console.error("Error decrypting received message:", error);
      }
    });
  },

  // Function to unsubscribe from real-time message updates
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage"); // Remove the "newMessage" event listener
  },

  // Function to set the selected user
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
