import { X } from "lucide-react"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { useChatStore } from "../store/useChatStore"; 

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore(); // Get the selected user and function to clear the selection
  const { onlineUsers } = useAuthStore(); // Get the list of online users

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.png"} // Display the user's profile picture or a default avatar
                alt={selectedUser.fullName} // Use the user's full name as the alt text
              />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser.fullName}</h3> {/* Display the user's full name */}
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} {/* Show online/offline status */}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}> {/* Clear the selected user when clicked */}
          <X /> {/* Render the close icon */}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;