import { useChatStore } from "../store/useChatStore"; 
import { useEffect, useRef } from "react";
import ChatHeader from "./ChatHeader"; 
import MessageInput from "./MessageInput"; 
import MessageSkeleton from "./skeletons/MessageSkeleton"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { formatMessageTime } from "../lib/utils.js"; 

const ChatContainer = () => {
  const {
    messages, // List of messages
    getMessages, // Function to fetch messages
    isMessagesLoading, // Boolean indicating if messages are being loaded
    selectedUser, // The currently selected user for the chat
    subscribeToMessages, // Function to subscribe to real-time message updates
    unsubscribeFromMessages, // Function to unsubscribe from real-time message updates
  } = useChatStore();
  const { authUser } = useAuthStore(); // Get the authenticated user's details
  const messageEndRef = useRef(null); // Reference to the end of the message list for scrolling

  // Fetch messages when the selected user changes
  useEffect(() => {
    if (selectedUser?._id) {
      getMessages(selectedUser._id); // Fetch messages for the selected user
    }

    subscribeToMessages(); // Subscribe to real-time message updates

    return () => unsubscribeFromMessages(); // Unsubscribe when the component unmounts or dependencies change
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" }); // Smoothly scroll to the bottom
    }
  }, [messages]);

  // Show skeleton loading screen if messages are still loading
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader /> {/* Render the chat header */}
        <MessageSkeleton /> {/* Render the skeleton loader */}
        <MessageInput /> {/* Render the message input */}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader /> {/* Render the chat header */}

      {/* Message list container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div>No messages to display.</div> // Show a message if there are no messages
        ) : (
          messages.map((message) => (
            <div
              key={message._id} // Unique key for each message
              className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} // Align messages based on sender
              ref={messageEndRef} // Reference to the last message for scrolling
            >
              {/* Avatar for the message sender */}
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      message.senderId === authUser._id
                        ? authUser.profilePic || "/avatar.png" // Use the authenticated user's profile picture
                        : selectedUser.profilePic || "/avatar.png" // Use the selected user's profile picture
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              {/* Message header with timestamp */}
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)} {/* Format and display the message timestamp */}
                </time>
              </div>

              {/* Message bubble */}
              <div className="chat-bubble flex flex-col">
                {message.text && <p>{message.text}</p>} {/* Display the message text */}
              </div>
            </div>
          ))
        )}
      </div>

      <MessageInput /> {/* Render the message input */}
    </div>
  );
};

export default ChatContainer;