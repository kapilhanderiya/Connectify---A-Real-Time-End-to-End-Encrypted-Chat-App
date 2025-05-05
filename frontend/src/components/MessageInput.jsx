import { useRef, useState } from "react"; 
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react"; 

const MessageInput = () => {
  const [text, setText] = useState(""); // State to manage the input text
  const fileInputRef = useRef(null); // Reference to the file input element
  const { sendMessages } = useChatStore(); // Get the function to send messages from the chat store

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    if (!text.trim()) return; // Do nothing if the input text is empty or only whitespace

    try {
      // Send the message using the chat store's sendMessages function
      await sendMessages({
        text: text.trim(), // Trim whitespace from the input text
      });

      setText(""); // Clear the input text after sending the message
      if (fileInputRef.current) fileInputRef.current.value = ""; // Clear the file input if it exists
    } catch (error) {
      console.error("Failed to send message:", error); // Log an error if the message fails to send
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Form for sending messages */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Input field for typing a message */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..." // Placeholder text for the input field
            value={text} // Bind the input value to the text state
            onChange={(e) => setText(e.target.value)} // Update the text state on input change
          />
        </div>
        {/* Button to send the message */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()} // Disable the button if the input text is empty
        >
          <Send size={22} /> {/* Send icon */}
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 