export const openSentMessagesDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("sentMessagesDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("sentMessages")) {
          db.createObjectStore("sentMessages", { keyPath: "id" }); // Use a unique key for each message
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };
  
  export const saveSentMessage = async (message) => {
    const db = await openSentMessagesDB();
    const transaction = db.transaction("sentMessages", "readwrite");
    const store = transaction.objectStore("sentMessages");
    store.put(message); // Save the message
    return transaction.complete;
  };
  
  export const getSentMessages = async () => {
    const db = await openSentMessagesDB();
    const transaction = db.transaction("sentMessages", "readonly");
    const store = transaction.objectStore("sentMessages");
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = (event) => reject(event.target.error);
    });
  };