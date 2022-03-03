const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");

const formatMessag = require("./utils/messages");
const {
  newUser,
  getCurrentUser,
  removeUser,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

const bot = "Asana Bot";

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("joinroom", ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessag(bot, "Welcome to the chat"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessag(bot, `${user.username} has joined the chat`)
      );

    //   Send room and users info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessag(user.username, msg));
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessag(bot, `${user.username} has left the chat`)
      );

      //   Send room and users info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, console.log(`Listening on port ${PORT}...`));
