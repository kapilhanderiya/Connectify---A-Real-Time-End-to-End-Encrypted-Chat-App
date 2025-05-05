// Function to format a given date into a time string
export function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit", // Display the hour in 2-digit format
    minute: "2-digit", // Display the minute in 2-digit format
    hour12: false, // Use 24-hour format
  });
}