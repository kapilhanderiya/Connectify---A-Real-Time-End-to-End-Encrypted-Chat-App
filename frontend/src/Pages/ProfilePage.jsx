import { useState } from "react"; 
import { useAuthStore } from "../store/useAuthStore"; 
import { Camera, Mail, User } from "lucide-react"; 

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore(); // Get authenticated user details and profile update functions
  const [selectedImg, setSelectedImg] = useState(null); // State to manage the selected profile image

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (!file) return;

    const reader = new FileReader(); // Create a FileReader to read the file

    reader.readAsDataURL(file); // Convert the file to a base64 string

    reader.onload = async () => {
      const base64Image = reader.result; // Get the base64 string
      setSelectedImg(base64Image); // Update the selected image state
      await updateProfile({ profilePic: base64Image }); // Update the profile picture
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          {/* Profile Header */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"} // Display the selected image, user's profile picture, or a default avatar
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""} // Disable interaction while updating
                `}
              >
                <Camera className="w-5 h-5 text-base-200" /> {/* Camera icon */}
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*" // Accept only image files
                  onChange={handleImageUpload} // Handle image upload
                  disabled={isUpdatingProfile} // Disable input while updating
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"} {/* Status message */}
            </p>
          </div>

          {/* User Information */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" /> {/* User icon */}
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p> {/* Display full name */}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" /> {/* Mail icon */}
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p> {/* Display email */}
            </div>
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              {/* Member Since */}
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span> {/* Display account creation date */}
              </div>
              {/* Account Status */}
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span> {/* Display account status */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 