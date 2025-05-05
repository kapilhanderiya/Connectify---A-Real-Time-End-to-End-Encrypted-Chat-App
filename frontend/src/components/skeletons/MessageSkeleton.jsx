const MessageSkeleton = () => {
  // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null); // This array is used to render 6 skeleton placeholders

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* Map through the skeletonMessages array to render skeleton placeholders */}
      {skeletonMessages.map((_, idx) => (
        <div 
          key={idx} 
          className={`chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`} // Alternate between "chat-start" and "chat-end" for alignment
        >
          {/* Skeleton for the avatar */}
          <div className="chat-image avatar">
            <div className="size-10 rounded-full">
              <div className="skeleton w-full h-full rounded-full" /> {/* Circular skeleton for the avatar */}
            </div>
          </div>

          {/* Skeleton for the chat header */}
          <div className="chat-header mb-1">
            <div className="skeleton h-4 w-16" /> {/* Rectangular skeleton for the header */}
          </div>

          {/* Skeleton for the chat bubble */}
          <div className="chat-bubble bg-transparent p-0">
            <div className="skeleton h-16 w-[200px]" /> {/* Rectangular skeleton for the message bubble */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageSkeleton;