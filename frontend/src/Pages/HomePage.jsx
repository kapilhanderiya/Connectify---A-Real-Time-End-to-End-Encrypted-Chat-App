import { useChatStore } from "../store/useChatStore"; 

import Sidebar from "../components/Sidebar"; 
import NoChatSelected from "../components/NoChatSelected"; 
import ChatContainer from "../components/ChatContainer"; 

const HomePage = () => {
  const { selectedUser } = useChatStore(); // Get the currently selected user from the chat store

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar /> {/* Render the Sidebar component */}

            {/* Conditionally render NoChatSelected or ChatContainer based on whether a user is selected */}
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;