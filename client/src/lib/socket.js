import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'https://si-nonnas.onrender.com', {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
