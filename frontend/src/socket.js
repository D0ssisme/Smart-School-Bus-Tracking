import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Địa chỉ backend
export default socket;
