// Function to generate an RSA key pair
export async function generateKeyPair() {
  try {
    return await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP", // Algorithm name
        modulusLength: 2048, // Key size in bits
        publicExponent: new Uint8Array([1, 0, 1]), // Public exponent
        hash: "SHA-256", // Hashing algorithm
      },
      true, // Keys are extractable
      ["encrypt", "decrypt"] // Key usages
    );
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error("Failed to generate key pair.");
  }
}

// Function to save the private key to IndexedDB
export async function savePrivateKeyToIndexedDB(privateKey) {
  try {
    const exportedKey = await window.crypto.subtle.exportKey("pkcs8", privateKey); // Export the private key
    const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey))); // Convert to Base64

    const db = await openDatabase(); // Open IndexedDB
    const tx = db.transaction("keys", "readwrite");
    tx.objectStore("keys").put(keyBase64, "privateKey"); // Save the private key
    await tx.complete;
    console.log("Private key saved successfully.");
  } catch (error) {
    console.error("Error saving private key to IndexedDB:", error);
    throw new Error("Failed to save private key.");
  }
}

// Function to retrieve the private key from IndexedDB
export async function getPrivateKeyFromIndexedDB() {
  try {
    const db = await openDatabase(); // Open IndexedDB
    const tx = db.transaction("keys", "readonly");
    const request = tx.objectStore("keys").get("privateKey");

    // Wait for the request to complete and get the result
    const keyBase64 = await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        console.log("Retrieved Private Key (Base64):", request.result);
        resolve(request.result);
      };
      request.onerror = () => {
        console.error("Error retrieving private key from IndexedDB:", request.error);
        reject(new Error("Failed to retrieve private key."));
      };
    });

    if (!keyBase64) {
      throw new Error("Private key not found in IndexedDB.");
    }

    if (!isBase64(keyBase64)) {
      throw new Error("Retrieved private key is not a valid Base64 string.");
    }

    const binaryDer = Uint8Array.from(atob(keyBase64.trim()), (c) => c.charCodeAt(0)); // Decode Base64
    return await window.crypto.subtle.importKey(
      "pkcs8",
      binaryDer,
      {
        name: "RSA-OAEP", // Algorithm name
        hash: "SHA-256", // Hashing algorithm
      },
      true,
      ["decrypt"] // Key usage
    );
  } catch (error) {
    console.error("Error retrieving private key from IndexedDB:", error);
    throw new Error("Failed to retrieve private key.");
  }
}

// Function to delete the private key from IndexedDB
export async function deletePrivateKeyFromIndexedDB() {
  try {
    const db = await openDatabase(); // Open IndexedDB
    const tx = db.transaction("keys", "readwrite");
    tx.objectStore("keys").delete("privateKey"); // Delete the private key
    await tx.complete;
    console.log("Private key deleted from IndexedDB.");
  } catch (error) {
    console.error("Error deleting private key from IndexedDB:", error);
    throw new Error("Failed to delete private key.");
  }
}

// Function to open IndexedDB
async function openDatabase() {
  try {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("E2EE-Keys", 1); // Open the database
      request.onupgradeneeded = () => {
        request.result.createObjectStore("keys"); // Create an object store
      };
      request.onsuccess = () => resolve(request.result); // Resolve with the database instance
      request.onerror = (event) => {
        console.error("Error opening IndexedDB:", event.target.error);
        reject(new Error("Failed to open IndexedDB."));
      };
    });
  } catch (error) {
    console.error("Error initializing IndexedDB:", error);
    throw new Error("Failed to initialize IndexedDB.");
  }
}

// Function to export the public key
export async function exportPublicKey(key) {
  try {
    const spki = await window.crypto.subtle.exportKey("spki", key); // Export the public key
    return btoa(String.fromCharCode(...new Uint8Array(spki))); // Convert to Base64
  } catch (error) {
    console.error("Error exporting public key:", error);
    throw new Error("Failed to export public key.");
  }
}

// Function to import a public key
export async function importPublicKey(spkiBase64) {
  try {
    const binaryDer = Uint8Array.from(atob(spkiBase64), (c) => c.charCodeAt(0)); // Decode Base64
    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP", // Algorithm name
        hash: "SHA-256", // Hashing algorithm
      },
      true,
      ["encrypt"] // Key usage
    );
  } catch (error) {
    console.error("Error importing public key:", error);
    throw new Error("Failed to import public key.");
  }
}

// Function to encrypt a message using a public key
export async function encryptMessage(publicKey, message) {
  try {
    const encoded = new TextEncoder().encode(message); // Encode the message
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      publicKey,
      encoded
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted))); // Convert to Base64
  } catch (error) {
    console.error("Error encrypting message:", error);
    throw new Error("Failed to encrypt message.");
  }
}

// Function to check if a string is Base64
function isBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (error) {
    return false;
  }
}

// Function to decrypt a message using a private key
export async function decryptMessage(privateKey, encryptedBase64) {
  try {
    if (!isBase64(encryptedBase64)) {
      throw new Error("Invalid Base64 string.");
    }

    const encryptedBuffer = new Uint8Array([...atob(encryptedBase64)].map((c) => c.charCodeAt(0))).buffer; // Decode Base64
    const decrypted = await window.crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      privateKey,
      encryptedBuffer
    );

    return new TextDecoder().decode(decrypted); // Decode the decrypted message
  } catch (error) {
    console.error("Error decrypting message:", error);
    throw new Error("Failed to decrypt message.");
  }
}
