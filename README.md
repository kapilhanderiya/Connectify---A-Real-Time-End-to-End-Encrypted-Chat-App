# Connectify - A Real Time End-to-End Encrypted Chat App

Connectify is a full-stack chat application that provides end-to-end encryption for secure communication. It allows users to send and receive messages in real-time, ensuring privacy and security.

##Highlights:

-  Tech stack: MERN + Socket.io + TailwindCSS + Daisy UI
-  Authentication && Authorization with JWT
-  Real-time messaging with Socket.io
-  Online user status
-  Global state management with Zustand
-  Error handling both on the server and on the client
-  End-to-End Encrypted using RSA
-  

## Tech Stack

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **TailwindCSS**: For styling.
- **Zustand**: For state management.
- **React Router**: For client-side routing.
- **Socket.IO Client**: For real-time communication.

### Backend
- **Node.js**: For server-side logic.
- **Express**: For building RESTful APIs.
- **MongoDB**: For database storage.
- **Mongoose**: For object data modeling.
- **Socket.IO**: For real-time communication.
- **Cloudinary**: For image storage.
- **JWT**: For secure authentication.

##Setup

### Setup .env file

```js
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

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
