import { useEffect, useState } from "react"; 
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react"; 

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore(); // Get chat-related state and functions
  const { onlineUsers } = useAuthStore(); // Get the list of online users from the auth store
  const [showOnlineOnly, setShowOnlineOnly] = useState(false); // State to toggle showing only online users

  // Fetch the list of users when the component mounts
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Filter users based on the "show online only" toggle
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id)) // Show only online users
    : users; // Show all users

  // Show the skeleton loader while users are being loaded
  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Sidebar header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" /> {/* Users icon */}
          <span className="font-medium hidden lg:block">Contacts</span> {/* Header text, visible on larger screens */}
        </div>

        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly} // Bind the checkbox to the "show online only" state
              onChange={(e) => setShowOnlineOnly(e.target.checked)} // Update the state on toggle
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span> {/* Label for the toggle */}
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span> {/* Count of online users */}
        </div>
      </div>

      {/* Sidebar user list */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id} // Unique key for each user
            onClick={() => setSelectedUser(user)} // Set the selected user on click
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""} // Highlight the selected user
            `}
          >
            {/* User avatar */}
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"} // Display the user's profile picture or a default avatar
                alt={user.name} // Use the user's name as the alt text
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                /> // Online status indicator
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div> {/* User's full name */}
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"} {/* Online/offline status */}
              </div>
            </div>
          </button>
        ))}

        {/* Message if no users are available */}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar; 