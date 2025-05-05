# Connectify - A Real Time End-to-End Encrypted Chat App

Connectify is a full-stack chat application that provides end-to-end encryption for secure communication. It allows users to send and receive messages in real-time, ensuring privacy and security.


## Features

- **End-to-End Encryption**: Messages are encrypted and decryptedg locally for secure communication.
- **Real-Time Messaging**: Powered by Socket.IO for instant message delivery.
- **User Authentication and Authorization**: Secure signup, login, and logout functionality with JWT-based authorization.
- **Global State Management**: Zustand is used for efficient and lightweight state management across the application.
- **Error Handling**: Comprehensive error handling for both frontend and backend to ensure a smooth user experience.
- **Online Status**: View online users in real-time.


## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **TailwindCSS**: For styling.
- **Zustand**: For state management.
- **React Router**: For client-side routing.
- **Socket.IO Client**: For real-time communication.
- **RSA (Asymmetric Encryption)**: For encrypting messages and securely exchanging keys.

### Backend
- **Node.js**: For server-side logic.
- **Express**: For building RESTful APIs.
- **MongoDB**: For database storage.
- **Mongoose**: For object data modeling.
- **Socket.IO**: For real-time communication.
- **Cloudinary**: For image storage.
- **JWT**: For secure authentication.


## Setup

### Setup .env file

```js
PORT=5073
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm run dev
```
