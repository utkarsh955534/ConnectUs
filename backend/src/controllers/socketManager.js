import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // =========================
    // JOIN CALL (ROOM)
    // =========================
    socket.on("join-call", (roomId) => {

      if (!connections[roomId]) {
        connections[roomId] = [];
      }

      connections[roomId].push(socket.id);
      timeOnline[socket.id] = new Date();

      // Notify all users in room
      connections[roomId].forEach(id => {
        io.to(id).emit("user-joined", socket.id, connections[roomId]);
      });

      // Send old chat messages
      if (messages[roomId]) {
        messages[roomId].forEach(msg => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg.socketId
          );
        });
      }
    });

    // =========================
    // WEBRTC SIGNALING
    // =========================
    socket.on("signal", (toId, data) => {
      if (io.sockets.sockets.get(toId)) {
        io.to(toId).emit("signal", socket.id, data);
      }
    });

    // =========================
    // CHAT MESSAGE
    // =========================
    socket.on("chat-message", (data, sender) => {

      let roomFound = null;

      for (const [roomId, users] of Object.entries(connections)) {
        if (users.includes(socket.id)) {
          roomFound = roomId;
          break;
        }
      }

      if (!roomFound) return;

      if (!messages[roomFound]) {
        messages[roomFound] = [];
      }

      messages[roomFound].push({
        sender,
        data,
        socketId: socket.id
      });

      connections[roomFound].forEach(id => {
        io.to(id).emit("chat-message", data, sender, socket.id);
      });
    });

    // =========================
    // DISCONNECT
    // =========================
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      const disconnectTime = new Date();
      const onlineTime = timeOnline[socket.id]
        ? Math.abs(disconnectTime - timeOnline[socket.id])
        : 0;

      delete timeOnline[socket.id];

      for (const [roomId, users] of Object.entries(connections)) {

        if (users.includes(socket.id)) {

          connections[roomId] = users.filter(id => id !== socket.id);

          connections[roomId].forEach(id => {
            io.to(id).emit("user-left", socket.id);
          });

          if (connections[roomId].length === 0) {
            delete connections[roomId];
            delete messages[roomId];
          }

          break;
        }
      }
    });

  });

  return io;
};
