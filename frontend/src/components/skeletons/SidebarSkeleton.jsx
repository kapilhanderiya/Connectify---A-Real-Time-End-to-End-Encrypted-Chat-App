import { Users } from "lucide-react"; // Import the Users icon from the lucide-react library

const SidebarSkeleton = () => {
  // Create an array of 8 skeleton items for the sidebar contacts
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-base-300 
    flex flex-col transition-all duration-200"
    >
      {/* Header section of the sidebar */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6" /> {/* Icon for the header */}
          <span className="font-medium hidden lg:block">Contacts</span> {/* Header text, visible on larger screens */}
        </div>
      </div>

      {/* Skeleton placeholders for the contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="w-full p-3 flex items-center gap-3">
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" /> {/* Circular skeleton for the avatar */}
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2" /> {/* Skeleton for the user's name */}
              <div className="skeleton h-3 w-16" /> {/* Skeleton for additional user info */}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;