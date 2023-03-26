require("dotenv").config();
const path = require("path");
const express = require("express");
const { formatMessage } = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();

const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");


const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));
const botName = "ChatCord Bot";

//Run when Client is connected
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    // welcome current user
    socket.emit(
      "message",
      formatMessage(botName, "Welcome to Chat With friends!")
    );

    //Broadcast When a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, ` ${user.username} has joined the chat`)
      );

      // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //Listen For chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // Run when client disconnect
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
        io.to(user.room).emit(
          "message",
          formatMessage(botName, `${user.username} has left the chat`)
        );

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
          });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
